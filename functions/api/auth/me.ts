// Fit Monk Edge API: GET /api/auth/me
// Returns current authenticated admin profile or 401 if unauthenticated.

import { AuthService } from '../../../src/backend/services/auth-service';

interface Env {
  DB?: any;
}

export const onRequestGet = async ({ request, env }: { request: Request; env: Env }) => {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/fitmonk_admin_session=([^;]+)/);
    const rawToken = match ? match[1] : null;

    if (!rawToken) {
      return new Response(
        JSON.stringify({ authenticated: false, admin: null }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!env.DB) {
      // Mock dev response
      if (rawToken.startsWith('fm_dev_sess_')) {
        return new Response(
          JSON.stringify({
            authenticated: true,
            admin: {
              id: 'adm_dev_mock',
              email: 'admin@fitmonk.co.in',
              name: 'Store Owner',
              role: 'super_admin'
            }
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return new Response(
        JSON.stringify({ authenticated: false, admin: null }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const tokenHash = await AuthService.hashToken(rawToken);
    const now = Math.floor(Date.now() / 1000);

    const session = await env.DB.prepare(
      `SELECT s.*, a.name, a.email, a.role_id AS role, a.is_active
       FROM admin_sessions s
       JOIN admins a ON s.admin_id = a.id
       WHERE s.token_hash = ? AND s.expires_at > ? AND a.is_active = 1
       LIMIT 1`
    ).bind(tokenHash, now).first();

    if (!session) {
      return new Response(
        JSON.stringify({ authenticated: false, admin: null }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Refresh last active timestamp
    await env.DB.prepare(
      `UPDATE admin_sessions SET last_active_at = ? WHERE id = ?`
    ).bind(now, session.id).run();

    return new Response(
      JSON.stringify({
        authenticated: true,
        admin: {
          id: session.admin_id,
          email: session.email,
          name: session.name,
          role: session.role
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ authenticated: false, error: err?.message || 'Verification error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
