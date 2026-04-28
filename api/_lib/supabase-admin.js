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
