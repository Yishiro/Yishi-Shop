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
