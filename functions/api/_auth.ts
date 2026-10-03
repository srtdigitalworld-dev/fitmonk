// Fit Monk Functions Auth Helper
// Verifies admin session token against Cloudflare D1 admin_sessions and admins tables

import { AuthService } from '../../src/backend/services/auth-service';

export interface AuthenticatedAdmin {
  id: string;
  email: string;
  name: string;
  role: string;
  is_active: number;
}

export async function getAuthenticatedAdmin(request: Request, env: { DB?: any }): Promise<AuthenticatedAdmin | null> {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/fitmonk_admin_session=([^;]+)/);
    const rawToken = match ? match[1] : null;

    if (!rawToken) {
      return null;
    }

    if (!env.DB) {
      if (rawToken.startsWith('fm_dev_sess_')) {
        return {
          id: 'adm_dev_mock',
          email: 'admin@fitmonk.co.in',
          name: 'Store Admin',
          role: 'super_admin',
          is_active: 1
        };
      }
      return null;
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
      return null;
    }

    return {
      id: session.admin_id,
      email: session.email,
      name: session.name,
      role: session.role,
      is_active: session.is_active
    };
  } catch (e) {
    return null;
  }
}
