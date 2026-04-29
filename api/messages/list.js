import {
  getOrderById,
  getUserFromAccessToken,
  listMessagesByOrder,
} from "../_lib/supabase-admin.js";
import { readJsonBody, sendJson } from "../_lib/response.js";

const adminEmail = "yishiroof@gmail.com";
const getFriendlyError = (error) => {
  const message = String(error?.message || "");
  if (/PGRST205|order_messages/i.test(message)) {
    return "Active d'abord la table order_messages dans Supabase avec le fichier supabase-orders.sql.";
  }

  return message || "Impossible de charger les messages.";
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

    const { orderId } = await readJsonBody(request);
    if (!orderId) {
      return sendJson(response, 400, { error: "Missing order id." });
    }

    const user = await getUserFromAccessToken(accessToken);
    const order = await getOrderById(orderId);

    if (!order) {
      return sendJson(response, 404, { error: "Order not found." });
    }

    const isAdmin =
      String(user?.email || "").trim().toLowerCase() === adminEmail;
    const isOwner =
      order.user_id === user.id ||
      String(order.user_email || "").trim().toLowerCase() ===
        String(user?.email || "").trim().toLowerCase();

    if (!isAdmin && !isOwner) {
      return sendJson(response, 403, { error: "Access denied." });
    }

    const messages = await listMessagesByOrder(orderId);
    return sendJson(response, 200, { messages });
  } catch (error) {
    return sendJson(response, 500, {
      error: getFriendlyError(error),
    });
  }
}
