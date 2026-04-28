import { getPayPalConfig } from "../../_lib/env.js";
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
    const { baseUrl } = getPayPalConfig();
    const token = await getPayPalToken();
    const { orderId, paypalOrderId } = await readJsonBody(request);

    const paypalResponse = await fetch(
      `${baseUrl}/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const paypalData = await paypalResponse.json();

    if (!paypalResponse.ok) {
      throw new Error(paypalData.message || "PayPal capture error.");
    }

    if (paypalData.status !== "COMPLETED") {
      throw new Error("Le paiement PayPal n'est pas encore complete.");
    }

    await updateOrder(orderId, {
      status: "paid",
      provider_order_id: paypalData.id,
    });

    return sendJson(response, 200, { ok: true });
  } catch (error) {
    return sendJson(response, 500, {
      error: error.message || "Impossible de capturer le paiement PayPal.",
    });
  }
}
