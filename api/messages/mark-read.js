import {
  getOrderById,
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

    const { orderId } = await readJsonBody(request);
    if (!orderId) {
      return sendJson(response, 400, { error: "Missing order id." });
    }

    const user = await getUserFromAccessToken(accessToken);
    const order = await getOrderById(orderId);

    if (!order) {
      return sendJson(response, 404, { error: "Order not found." });
    }

    const email = String(user?.email || "").trim().toLowerCase();
    const isAdmin = adminEmails.has(email);
    const isOwner =
      order.user_id === user.id ||
      String(order.user_email || "").trim().toLowerCase() === email;

    if (!isAdmin && !isOwner) {
      return sendJson(response, 403, { error: "Access denied." });
    }

    await updateOrder(orderId, isAdmin ? { unread_for_admin: 0 } : { unread_for_buyer: 0 });

    return sendJson(response, 200, { ok: true });
  } catch (error) {
    return sendJson(response, 500, {
      error: error.message || "Impossible de marquer les messages comme lus.",
    });
  }
}
