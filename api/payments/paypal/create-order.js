import { getBaseUrl, getPayPalConfig } from "../../_lib/env.js";
import { readJsonBody, sendJson } from "../../_lib/response.js";
import { updateOrder } from "../../_lib/supabase-admin.js";

const getPayPalToken = async () => {
  const { clientId, clientSecret, baseUrl } = getPayPalConfig();
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error_description || "PayPal token error.");
  }
  return data.access_token;
};

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return sendJson(response, 405, { error: "Method not allowed." });
  }

  try {
    const token = await getPayPalToken();
    const { baseUrl } = getPayPalConfig();
    const siteUrl = getBaseUrl(request);
    const body = await readJsonBody(request);
    const { orderId, productTitle, totalPrice } = body;

    const paypalResponse = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: orderId,
            description: productTitle,
            amount: {
              currency_code: "EUR",
              value: Number(totalPrice).toFixed(2),
            },
          },
        ],
        application_context: {
          return_url: `${siteUrl}/payment-return.html?provider=paypal&orderId=${encodeURIComponent(orderId)}`,
          cancel_url: `${siteUrl}/payment-return.html?provider=paypal&orderId=${encodeURIComponent(orderId)}&status=cancel`,
        },
      }),
    });

    const paypalData = await paypalResponse.json();

    if (!paypalResponse.ok) {
      throw new Error(paypalData.message || "PayPal order error.");
    }

    await updateOrder(orderId, {
      provider_order_id: paypalData.id,
    });

    const approvalLink = paypalData.links?.find((link) => link.rel === "approve")?.href;

    return sendJson(response, 200, {
      url: approvalLink,
      paypalOrderId: paypalData.id,
    });
  } catch (error) {
    return sendJson(response, 500, {
      error:
        error.message ||
        "Impossible de creer l'ordre PayPal. Verifie les variables d'environnement Vercel.",
    });
  }
}
