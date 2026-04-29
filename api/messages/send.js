import {
  getOrderById,
  getUserFromAccessToken,
  insertMessage,
  updateOrder,
} from "../_lib/supabase-admin.js";
import { readJsonBody, sendJson } from "../_lib/response.js";

const adminEmails = new Set([
  "yishiroof@gmail.com",
  "hichem.hichem041107@gmail.com",
]);
const getFriendlyError = (error) => {
  const message = String(error?.message || "");
  if (/PGRST205|order_messages/i.test(message)) {
    return "Active d'abord la table order_messages dans Supabase avec le fichier supabase-orders.sql.";
  }

  return message || "Impossible d'envoyer le message.";
};

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

    const { orderId, message } = await readJsonBody(request);
    if (!orderId || !String(message || "").trim()) {
      return sendJson(response, 400, { error: "Missing message payload." });
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

    await insertMessage({
      order_id: orderId,
      user_id: user.id,
      user_email: user.email || "",
      author_role: isAdmin ? "admin" : "buyer",
      message: String(message).trim(),
    });

    await updateOrder(orderId, {
      last_message_at: new Date().toISOString(),
      last_message_preview: String(message).trim().slice(0, 180),
      last_message_author_role: isAdmin ? "admin" : "buyer",
      unread_for_admin: isAdmin ? 0 : Number(order.unread_for_admin || 0) + 1,
      unread_for_buyer: isAdmin ? Number(order.unread_for_buyer || 0) + 1 : 0,
    });

    return sendJson(response, 200, { ok: true });
  } catch (error) {
    return sendJson(response, 500, {
      error: getFriendlyError(error),
    });
  }
}
