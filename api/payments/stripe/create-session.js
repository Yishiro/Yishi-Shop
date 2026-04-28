import { getBaseUrl, getStripeConfig } from "../../_lib/env.js";
import { readJsonBody, sendJson } from "../../_lib/response.js";

const toStripeAmount = (value) => Math.round(Number(value) * 100);

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return sendJson(response, 405, { error: "Method not allowed." });
  }

  try {
    const { secretKey } = getStripeConfig();
    const baseUrl = getBaseUrl(request);
    const body = await readJsonBody(request);
    const { orderId, productTitle, quantity, totalPrice } = body;

    const formData = new URLSearchParams();
    formData.set("mode", "payment");
    formData.set("success_url", `${baseUrl}/payment-return.html?provider=stripe&orderId=${encodeURIComponent(orderId)}&session_id={CHECKOUT_SESSION_ID}`);
    formData.set("cancel_url", `${baseUrl}/payment-return.html?provider=stripe&orderId=${encodeURIComponent(orderId)}&status=cancel`);
    formData.set("line_items[0][quantity]", String(quantity));
    formData.set("line_items[0][price_data][currency]", "eur");
    formData.set("line_items[0][price_data][unit_amount]", String(toStripeAmount(totalPrice) / Math.max(1, Number(quantity))));
    formData.set("line_items[0][price_data][product_data][name]", productTitle);
    formData.set("metadata[order_id]", orderId);

    const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    const stripeData = await stripeResponse.json();

    if (!stripeResponse.ok) {
      throw new Error(stripeData?.error?.message || "Stripe session error.");
    }

    return sendJson(response, 200, {
      url: stripeData.url,
      sessionId: stripeData.id,
    });
  } catch (error) {
    return sendJson(response, 500, {
      error:
        error.message ||
        "Impossible de creer la session Stripe. Verifie les variables d'environnement Vercel.",
    });
  }
}
