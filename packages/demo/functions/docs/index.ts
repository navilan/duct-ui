interface Env {
  ASSETS: Fetcher;           // default Pages binding for your static assets
}

export async function onRequestGet(
  { env, request }: EventContext<Env, any, unknown>
): Promise<Response> {
  // Always hand back the SPA shell (pretty path, *not* index.html)
  const url = new URL(request.url);
  url.pathname = "/docs/";            // <- pretty path required by env.ASSETS.fetch
  return env.ASSETS.fetch(url);       // serves /docs/index.html through asset layer
}