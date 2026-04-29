import {
  getUserFromAccessToken,
  updateOrder,
} from "../_lib/supabase-admin.js";
import { readJsonBody, sendJson } from "../_lib/response.js";

const adminEmails = new Set([
  "yishiroof@gmail.com",
  "hichem.hichem041107@gmail.com",
]);

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return sendJson(response, 405, { error: "Method not allowed." });
  }

  try {
    const authorization = request.headers.authorization || "";
    const accessToken = authorization.replace(/^Bearer\s+/i, "").trim();

    if (!accessToken) {
      return sendJson(response, 401, { error: "Missing access token." });
    }

    const user = await getUserFromAccessToken(accessToken);

    if (!adminEmails.has(String(user?.email || "").trim().toLowerCase())) {
      return sendJson(response, 403, { error: "Admin access only." });
    }

    const { orderId, adminNote } = await readJsonBody(request);
    if (!orderId) {
      return sendJson(response, 400, { error: "Missing order id." });
    }

    await updateOrder(orderId, {
      admin_note: String(adminNote || "").trim().slice(0, 4000),
    });

    return sendJson(response, 200, { ok: true });
  } catch (error) {
    return sendJson(response, 500, {
      error: error.message || "Impossible de mettre a jour la note admin.",
    });
  }
}
