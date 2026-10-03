// Fit Monk Edge API: POST /api/auth/login
// Secure admin login with PBKDF2 verification, session token generation, HttpOnly cookie, and audit log.

import { AuthService } from '../../../src/backend/services/auth-service';

interface Env {
  DB?: any;
}

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  try {
    const body = await request.json().catch(() => null) as any;
    const email = body?.email ? String(body.email).trim().toLowerCase() : '';
    const password = body?.password ? String(body.password) : '';

    if (!email || !password) {
      return new Response(
        JSON.stringify({ success: false, message: 'Email and password are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!env.DB) {
      // Local development fallback mock when running without D1 binding
      if (email === 'admin@fitmonk.co.in' && password === 'FitMonk@2026') {
        const dummyToken = 'fm_dev_sess_' + Math.random().toString(36).substring(2);
        return new Response(
          JSON.stringify({
            success: true,
            admin: {
              id: 'adm_dev_mock',
              email: 'admin@fitmonk.co.in',
              name: 'Store Owner',
              role: 'super_admin'
            }
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Set-Cookie': `fitmonk_admin_session=${dummyToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`
            }
          }
        );
      }

      return new Response(
        JSON.stringify({ success: false, message: 'Invalid admin credentials.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 1. Fetch admin by email
    const admin = await env.DB.prepare(
      `SELECT * FROM admins WHERE email = ? AND is_active = 1 LIMIT 1`
    ).bind(email).first();

    if (!admin) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid credentials or inactive account.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Verify password with PBKDF2-SHA256
    const isValid = await AuthService.verifyPassword(password, admin.password_hash, admin.password_salt);
    if (!isValid) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid credentials.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Create session
    const { token: rawToken, tokenHash } = await AuthService.createSessionToken();
    const sessionId = 'sess_' + Math.random().toString(36).substring(2, 10);
    const now = Math.floor(Date.now() / 1000);
    const expiresAt = now + 7 * 24 * 3600; // 7 days

    const ipAddress = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    await env.DB.prepare(
      `INSERT INTO admin_sessions (id, admin_id, token_hash, ip_address, user_agent, expires_at, created_at, last_active_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(sessionId, admin.id, tokenHash, ipAddress, userAgent, expiresAt, now, now).run();

    // 4. Update admin last login
    await env.DB.prepare(
      `UPDATE admins SET last_login_at = ?, updated_at = ? WHERE id = ?`
    ).bind(now, now, admin.id).run();

    // 5. Audit log
    await env.DB.prepare(
      `INSERT INTO audit_logs (id, admin_id, action, entity_type, entity_id, ip_address, user_agent, created_at)
       VALUES (?, ?, 'admin.login', 'admin', ?, ?, ?, ?)`
    ).bind('aud_' + Math.random().toString(36).substring(2, 10), admin.id, admin.id, ipAddress, userAgent, now).run();

    return new Response(
      JSON.stringify({
        success: true,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        }
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': `fitmonk_admin_session=${rawToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`
        }
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, message: err?.message || 'Login failed.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
