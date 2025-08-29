// Cloudflare Worker for Duct UI Search API
import { SearchWorkerHandler } from '@duct-ui/cloudflare-search-provider/worker'

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const pathname = url.pathname
    
    // Optional: Mount on /api prefix (remove if not needed)
    if (pathname.startsWith('/api/')) {
      const newUrl = new URL(request.url)
      newUrl.pathname = pathname.substring(4) // Remove '/api'
      const newRequest = new Request(newUrl, request)
      
      const handler = new SearchWorkerHandler(env)
      return handler.handleRequest(newRequest)
    }
    
    // Direct routing (use this if not mounting on /api)
    // const handler = new SearchWorkerHandler(env)
    // return handler.handleRequest(request)
    
    return new Response('Not Found', { status: 404 })
  }
}