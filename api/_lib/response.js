export const sendJson = (response, status, payload) => {
  response.status(status).setHeader("Content-Type", "application/json");
  response.end(JSON.stringify(payload));
};

export const readJsonBody = async (request) => {
  if (request.body && typeof request.body === "object") {
    return request.body;
  }

  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
};
