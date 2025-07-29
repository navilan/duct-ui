interface Env {
  ASSETS: Fetcher;
}

export async function onRequestGet(
  context: EventContext<Env, any, unknown>
): Promise<Response> {
  const { request, env } = context;

  /* 1️⃣ First, try the request as-is — this serves real files like
        /docs/assets/app-1234.js or /docs/guide/logo.png straight from the
        Pages asset store, skipping any extra latency/cost. */
  const assetResp = await env.ASSETS.fetch(request);
  if (assetResp && assetResp.status !== 404) return assetResp;

  /* 2️⃣ Fallback: send the SPA shell so the front-end router can handle the
        in-app route (e.g. /docs/building-components). */
  const url = new URL(request.url);
  url.pathname = "/docs/";
  return env.ASSETS.fetch(url);
}