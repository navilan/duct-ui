// Cloudflare Worker for Duct UI Search API
import { SearchWorkerHandler } from '@duct-ui/cloudflare-search-provider/worker'

export default {
  async fetch(request, env) {
    const handler = new SearchWorkerHandler(env)
    return handler.handleRequest(request)
  }
}