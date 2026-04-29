import {
  deleteExpiredPendingOrders,
  getUserFromAccessToken,
  listOrders,
} from "../_lib/supabase-admin.js";
import { sendJson } from "../_lib/response.js";

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

    await deleteExpiredPendingOrders();
    const orders = await listOrders();

    return sendJson(response, 200, {
      orders: (orders || []).map((order) => ({
        ...order,
        user_email: order.user_email || order.email || "",
      })),
    });
  } catch (error) {
    return sendJson(response, 500, {
      error: error.message || "Impossible de charger les commandes admin.",
    });
  }
}
