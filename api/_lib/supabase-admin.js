import { getSupabaseConfig } from "./env.js";

const buildHeaders = () => {
  const config = getSupabaseConfig();
  return {
    apikey: config.serviceRoleKey,
    Authorization: `Bearer ${config.serviceRoleKey}`,
    "Content-Type": "application/json",
  };
};

export const updateOrder = async (orderId, patch) => {
  const { url } = getSupabaseConfig();
  const response = await fetch(
    `${url}/rest/v1/orders?id=eq.${encodeURIComponent(orderId)}`,
    {
      method: "PATCH",
      headers: {
        ...buildHeaders(),
        Prefer: "return=representation",
      },
      body: JSON.stringify(patch),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase update failed: ${text}`);
  }

  return response.json();
};

export const listOrders = async () => {
  const { url } = getSupabaseConfig();
  const response = await fetch(
    `${url}/rest/v1/orders?select=*&order=created_at.desc`,
    {
      headers: buildHeaders(),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase list failed: ${text}`);
  }

  return response.json();
};

export const getOrderById = async (orderId) => {
  const { url } = getSupabaseConfig();
  const response = await fetch(
    `${url}/rest/v1/orders?id=eq.${encodeURIComponent(orderId)}&select=*`,
    {
      headers: buildHeaders(),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase order lookup failed: ${text}`);
  }

  const rows = await response.json();
  return rows?.[0] || null;
};

export const listMessagesByOrder = async (orderId) => {
  const { url } = getSupabaseConfig();
  const response = await fetch(
    `${url}/rest/v1/order_messages?order_id=eq.${encodeURIComponent(orderId)}&select=*&order=created_at.asc`,
    {
      headers: buildHeaders(),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase message list failed: ${text}`);
  }

  return response.json();
};

export const getMessagesCountSince = async (orderId, authorRole, since) => {
  const { url } = getSupabaseConfig();
  const query = new URLSearchParams({
    order_id: `eq.${orderId}`,
    author_role: `eq.${authorRole}`,
    select: "id",
  });

  if (since) {
    query.set("created_at", `gt.${since}`);
  }

  const response = await fetch(`${url}/rest/v1/order_messages?${query.toString()}`, {
    headers: {
      ...buildHeaders(),
      Prefer: "count=exact",
      Range: "0-0",
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase message count failed: ${text}`);
  }

  const contentRange = response.headers.get("content-range") || "";
  const total = Number(contentRange.split("/")[1] || "0");
  return Number.isFinite(total) ? total : 0;
};

export const insertMessage = async (payload) => {
  const { url } = getSupabaseConfig();
  const response = await fetch(`${url}/rest/v1/order_messages`, {
    method: "POST",
    headers: {
      ...buildHeaders(),
      Prefer: "return=representation",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase message insert failed: ${text}`);
  }

  return response.json();
};

export const uploadAttachment = async ({
  bucket = "order-attachments",
  path,
  contentType,
  bytes,
}) => {
  const { url, serviceRoleKey } = getSupabaseConfig();
  const response = await fetch(
    `${url}/storage/v1/object/${bucket}/${path}`,
    {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": contentType || "application/octet-stream",
        "x-upsert": "true",
      },
      body: bytes,
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase attachment upload failed: ${text}`);
  }

  return {
    bucket,
    path,
    publicUrl: `${url}/storage/v1/object/public/${bucket}/${path}`,
  };
};

export const deleteExpiredPendingOrders = async () => {
  const { url } = getSupabaseConfig();
  const cutoff = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const response = await fetch(
    `${url}/rest/v1/orders?status=eq.pending_payment&created_at=lt.${encodeURIComponent(cutoff)}`,
    {
      method: "DELETE",
      headers: {
        ...buildHeaders(),
        Prefer: "return=minimal",
      },
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase cleanup failed: ${text}`);
  }
};

export const getUserFromAccessToken = async (accessToken) => {
  const { url, serviceRoleKey } = getSupabaseConfig();
  const response = await fetch(`${url}/auth/v1/user`, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase auth failed: ${text}`);
  }

  return response.json();
};
