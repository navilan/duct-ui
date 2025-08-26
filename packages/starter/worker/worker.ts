// Cloudflare Worker for Duct UI Search API
import { SearchWorkerHandler } from '@duct-ui/cloudflare-search-provider/worker'

export default {
  async fetch(request, env) {
    // Remove /api prefix from the URL for the handler
    const url = new URL(request.url)
    const pathname = url.pathname
    
    if (pathname.startsWith('/api/')) {
      // Create a new request with the /api prefix removed
      const newUrl = new URL(request.url)
      newUrl.pathname = pathname.substring(4) // Remove '/api'
      const newRequest = new Request(newUrl, request)
      
      const handler = new SearchWorkerHandler(env)
      return handler.handleRequest(newRequest)
    }
    
    // If not an /api route, return 404
    return new Response('Not Found', { status: 404 })
  }
}