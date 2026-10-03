// Fit Monk Edge API: /api/settings
// Store settings management

interface Env {
  DB?: any;
}

export const onRequestGet = async ({ request, env }: { request: Request; env: Env }) => {
  try {
    const url = new URL(request.url);
    const group = url.searchParams.get('group');

    if (!env.DB) {
      return new Response(
        JSON.stringify({
          settings: {
            store_name: 'Fit Monk',
            store_tagline: 'Clean Nutrition & Healthy Pantry Essentials',
            support_email: 'support@fitmonk.co.in',
            support_phone: '+91 99999 99999',
            currency: 'INR',
            currency_symbol: '₹',
            free_shipping_threshold_paise: 49900,
            standard_shipping_fee_paise: 4900
          }
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let query = `SELECT key, value, type, \`group\` FROM settings WHERE is_public = 1`;
    const params: any[] = [];

    // If admin is requesting, allow all settings
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/fitmonk_admin_session=([^;]+)/);
    if (match) {
      query = `SELECT key, value, type, \`group\` FROM settings`;
    }

    if (group) {
      query += ` WHERE \`group\` = ?`;
      params.push(group);
    }

    const { results } = await env.DB.prepare(query).bind(...params).all();

    const formatted: Record<string, any> = {};
    for (const row of results as any[]) {
      if (row.type === 'number') formatted[row.key] = Number(row.value);
      else if (row.type === 'boolean') formatted[row.key] = row.value === 'true';
      else if (row.type === 'json') formatted[row.key] = JSON.parse(row.value);
      else formatted[row.key] = row.value;
    }

    return new Response(JSON.stringify({ settings: formatted }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || 'Error fetching settings' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
