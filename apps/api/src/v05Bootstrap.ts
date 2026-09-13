import express from 'express';
import { registerV05Routes } from './v05Routes.js';

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

if (!proto[marker]) {
  const originalUse = proto.use;
  proto.use = function patchedUse(this: express.Application & { __carepathUseCount?: number; __carepathV05Registered?: boolean }, ...args: any[]) {
    const result = originalUse.apply(this, args as any);
    this.__carepathUseCount = (this.__carepathUseCount ?? 0) + 1;

    // server.ts currently installs helmet, CORS, JSON parsing and session in
    // that order. Register after session exists and before API route handlers.
    if (this.__carepathUseCount === 4 && !this.__carepathV05Registered) {
      this.__carepathV05Registered = true;
      registerV05Routes(this);
    }
    return result;
  };
  proto[marker] = true;
}
