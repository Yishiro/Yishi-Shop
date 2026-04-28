import { getStripeConfig } from "../../_lib/env.js";
import { readJsonBody, sendJson } from "../../_lib/response.js";
import { updateOrder } from "../../_lib/supabase-admin.js";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return sendJson(response, 405, { error: "Method not allowed." });
  }

  try {
    const { secretKey } = getStripeConfig();
    const { orderId, stripeSessionId } = await readJsonBody(request);

    const stripeResponse = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(stripeSessionId)}`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      }
    );

    const stripeData = await stripeResponse.json();

    if (!stripeResponse.ok) {
      throw new Error(stripeData?.error?.message || "Stripe verification failed.");
    }

    if (stripeData.payment_status !== "paid") {
      throw new Error("Le paiement Stripe n'est pas encore confirme.");
    }

    await updateOrder(orderId, {
      status: "paid",
      provider_session_id: stripeData.id,
    });

    return sendJson(response, 200, { ok: true });
  } catch (error) {
    return sendJson(response, 500, {
      error: error.message || "Impossible de verifier la session Stripe.",
    });
  }
}
