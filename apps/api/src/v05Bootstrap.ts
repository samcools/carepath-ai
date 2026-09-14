import express, { type NextFunction, type Request, type Response } from 'express';
import { registerV05Routes } from './v05Routes.js';
import { registerAgentRoutes } from './agentRoutes.js';
import { requireAuth } from './auth.js';
import { users } from './data.js';

/**
 * Temporary v0.5+ extension bootstrap.
 *
 * The current hackathon API is still concentrated in server.ts. To preserve
 * working behavior while adding federated-platform and agent modules without
 * replacing the application shell, this hook attaches the extension routers
 * immediately after the existing security/session middleware is registered.
 */
const marker = Symbol.for('carepath.v05.bootstrap');
const proto = express.application as any;
const v05Auth = requireAuth(users);

function managementPatientGuard(req: Request, res: Response, next: NextFunction) {
  const role = req.currentUser?.role;
  if (!role) return res.status(401).json({ error: 'Authentication required' });

  if (role === 'MANAGER' || role === 'AUDITOR') {
    const patientLevelPrefixes = ['/identity', '/consent', '/care-plans', '/documents', '/emergency'];
    if (patientLevelPrefixes.some(prefix => req.path === prefix || req.path.startsWith(`${prefix}/`))) {
      return res.status(403).json({
        error: 'This oversight role is restricted to aggregated/de-identified views for this module.'
      });
    }
  }

  if (req.path === '/breakglass' || req.path.startsWith('/breakglass/')) {
    if (role === 'MANAGER' || (role === 'AUDITOR' && req.method !== 'GET')) {
      return res.status(403).json({ error: 'Break Glass access is restricted by role and purpose.' });
    }
  }

  next();
}

if (!proto[marker]) {
  const originalUse = proto.use;
  proto.use = function patchedUse(this: express.Application & { __carepathUseCount?: number; __carepathV05Registered?: boolean }, ...args: any[]) {
    const result = originalUse.apply(this, args as any);
    this.__carepathUseCount = (this.__carepathUseCount ?? 0) + 1;

    if (this.__carepathUseCount === 4 && !this.__carepathV05Registered) {
      this.__carepathV05Registered = true;
      originalUse.call(this, '/api/v05', v05Auth, managementPatientGuard);
      registerV05Routes(this);
      originalUse.call(this, '/api/agents', v05Auth);
      registerAgentRoutes(this);
    }
    return result;
  };
  proto[marker] = true;
}
