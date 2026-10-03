// Fit Monk Edge API: /api/shipping/rapidshyp
// RapidShyp modular shipping endpoint (Serviceability check, Courier estimate, AWB generation)

import { RapidShypProvider } from '../../../src/backend/providers/shipping/rapidshyp-provider';

interface Env {
  RAPIDSHYP_API_TOKEN?: string;
  RAPIDSHYP_BASE_URL?: string;
  RAPIDSHYP_PICKUP_PINCODE?: string;
}

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action') || 'serviceability';
    const body = await request.json().catch(() => null) as any;

    const provider = new RapidShypProvider({
      apiToken: env.RAPIDSHYP_API_TOKEN || undefined,
      baseUrl: env.RAPIDSHYP_BASE_URL,
      pickupPincode: env.RAPIDSHYP_PICKUP_PINCODE || '110001'
    });

    if (action === 'serviceability') {
      const deliveryPincode = body?.deliveryPincode ? String(body.deliveryPincode).trim() : '';
      if (!/^\d{6}$/.test(deliveryPincode)) {
        return new Response(
          JSON.stringify({
            isServiceable: false,
            message: 'Please provide a valid 6-digit Indian PIN code.'
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const isCod = body?.paymentType === 'cod' || Boolean(body?.cod);
      const weightGrams = Number(body?.weightGrams) || 500;
      const orderValuePaise = Number(body?.orderValuePaise) || 50000;

      const result = await provider.checkServiceability({
        pickupPincode: env.RAPIDSHYP_PICKUP_PINCODE || '110001',
        deliveryPincode,
        weightGrams,
        cod: isCod,
        orderValuePaise
      });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (action === 'track') {
      const awb = body?.awb ? String(body.awb).trim() : '';
      if (!awb) {
        return new Response(
          JSON.stringify({ error: 'AWB number is required.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const tracking = await provider.getTracking(awb);
      return new Response(JSON.stringify(tracking), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(
      JSON.stringify({ error: `Unknown shipping action: ${action}` }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || 'Error processing shipping request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
