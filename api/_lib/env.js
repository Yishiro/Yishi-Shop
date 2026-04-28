const requireEnv = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
};

export const getBaseUrl = (request) => {
  const forwardedProto = request.headers["x-forwarded-proto"] || "https";
  const forwardedHost = request.headers["x-forwarded-host"] || request.headers.host;
  return process.env.PUBLIC_SITE_URL || `${forwardedProto}://${forwardedHost}`;
};

export const getSupabaseConfig = () => ({
  url: requireEnv("SUPABASE_URL"),
  serviceRoleKey: requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
});

export const getStripeConfig = () => ({
  secretKey: requireEnv("STRIPE_SECRET_KEY"),
});

export const getPayPalConfig = () => ({
  clientId: requireEnv("PAYPAL_CLIENT_ID"),
  clientSecret: requireEnv("PAYPAL_CLIENT_SECRET"),
  baseUrl:
    process.env.PAYPAL_BASE_URL || "https://api-m.sandbox.paypal.com",
});
