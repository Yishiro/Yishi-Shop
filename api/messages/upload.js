import {
  getOrderById,
  getUserFromAccessToken,
  uploadAttachment,
} from "../_lib/supabase-admin.js";
import { readJsonBody, sendJson } from "../_lib/response.js";

const adminEmails = new Set([
  "yishiroof@gmail.com",
  "hichem.hichem041107@gmail.com",
]);

const sanitizeFileName = (value) =>
  String(value || "piece-jointe")
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

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

    const { orderId, fileName, fileType, fileData } = await readJsonBody(request);

    if (!orderId || !fileName || !fileData) {
      return sendJson(response, 400, { error: "Missing attachment payload." });
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

    const bytes = Buffer.from(String(fileData), "base64");
    if (bytes.byteLength > 5 * 1024 * 1024) {
      return sendJson(response, 400, {
        error: "La piece jointe depasse 5 Mo.",
      });
    }

    const safeName = sanitizeFileName(fileName);
    const path = `${orderId}/${Date.now()}-${safeName}`;
    const uploaded = await uploadAttachment({
      path,
      contentType: fileType || "application/octet-stream",
      bytes,
    });

    return sendJson(response, 200, {
      attachment: {
        url: uploaded.publicUrl,
        name: fileName,
        type: fileType || "application/octet-stream",
        size: bytes.byteLength,
      },
    });
  } catch (error) {
    return sendJson(response, 500, {
      error: error.message || "Impossible d'envoyer la piece jointe.",
    });
  }
}
