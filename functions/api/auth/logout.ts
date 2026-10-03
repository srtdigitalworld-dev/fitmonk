// Fit Monk Edge API: POST /api/auth/logout
// Securely invalidates session in D1 and clears session cookie.

import { AuthService } from '../../../src/backend/services/auth-service';

interface Env {
  DB?: any;
}

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/fitmonk_admin_session=([^;]+)/);
    const rawToken = match ? match[1] : null;

    if (rawToken && env.DB) {
      const tokenHash = await AuthService.hashToken(rawToken);
      await env.DB.prepare(`DELETE FROM admin_sessions WHERE token_hash = ?`).bind(tokenHash).run();
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Logged out successfully.' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': `fitmonk_admin_session=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`
        }
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, message: err?.message || 'Logout failed.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
