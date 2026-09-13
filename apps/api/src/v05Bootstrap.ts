import express, { type NextFunction, type Request, type Response } from 'express';
import { registerV05Routes } from './v05Routes.js';
import { requireAuth } from './auth.js';
import { users } from './data.js';

/**
 * Temporary v0.5 extension bootstrap.
 *
 * The current hackathon API is still concentrated in server.ts. To preserve
 * working v0.4 behavior while adding v0.5 modules without duplicating the
 * application shell, this hook attaches the v0.5 router immediately after the
 * existing security/session middleware has been registered.
 *
 * A later refactor should replace this compatibility hook with explicit router
 * composition in a small application bootstrap module.
 */
const marker = Symbol.for('carepath.v05.bootstrap');
const proto = express.application as any;
const v05Auth = requireAuth(users);

function managementPatientGuard(req: Request, res: Response, next: NextFunction) {
  const role = req.currentUser?.role;
  if (!role) return res.status(401).json({ error: 'Authentication required' });

  // Managers and auditors receive aggregated/de-identified management views by
  // default. They must not gain general longitudinal clinical access merely
  // because they hold an oversight role.
  if (role === 'MANAGER' || role === 'AUDITOR') {
    const patientLevelPrefixes = [
      '/identity', '/consent', '/care-plans', '/documents', '/emergency', '/breakglass'
    ];
    if (patientLevelPrefixes.some(prefix => req.path === prefix || req.path.startsWith(`${prefix}/`))) {
      return res.status(403).json({
        error: 'This oversight role is restricted to aggregated/de-identified views for this module.'
      });
    }
  }
  next();
}

if (!proto[marker]) {
  const originalUse = proto.use;
  proto.use = function patchedUse(this: express.Application & { __carepathUseCount?: number; __carepathV05Registered?: boolean }, ...args: any[]) {
    const result = originalUse.apply(this, args as any);
    this.__carepathUseCount = (this.__carepathUseCount ?? 0) + 1;

    // server.ts currently installs helmet, CORS, JSON parsing and session in
    // that order. Register after session exists and before API route handlers.
    if (this.__carepathUseCount === 4 && !this.__carepathV05Registered) {
      this.__carepathV05Registered = true;
      originalUse.call(this, '/api/v05', v05Auth, managementPatientGuard);
      registerV05Routes(this);
    }
    return result;
  };
  proto[marker] = true;
}
