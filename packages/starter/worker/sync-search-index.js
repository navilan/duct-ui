#!/usr/bin/env node

/**
 * Search index synchronization script for Cloudflare Worker
 * Loads environment variables from .env file and syncs search index
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '.env') });

async function syncSearchIndex() {

  const SITE_URL = process.env.SITE_URL || 'http://localhost:5173';
  const WORKER_URL = process.env.WORKER_URL || 'http://localhost:8788';
  const AUTH_TOKEN = process.env.SEARCH_INDEX_AUTH_TOKEN;

  if (!AUTH_TOKEN) {
    console.error('❌ SEARCH_INDEX_AUTH_TOKEN not found in environment or .env file');
    process.exit(1);
  }

  const indexUrl = `${SITE_URL}/search-index.json`;
  const syncUrl = `${WORKER_URL}/api/search/sync-index`;

  console.log(`🔄 Syncing search index...
  Site URL: ${SITE_URL}
  Worker URL: ${WORKER_URL}
  Index URL: ${indexUrl}
  Sync URL: ${syncUrl}`);

  try {
    const response = await fetch(syncUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: indexUrl })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log(`✅ Search index synced successfully!
  Entries: ${result.entriesCount || 'unknown'}
  Size: ${result.indexSize || 'unknown'} bytes
  Timestamp: ${new Date(result.timestamp).toISOString()}`);

  } catch (error) {
    console.error(`❌ Failed to sync search index: ${error.message}`);
    process.exit(1);
  }
}

syncSearchIndex().catch(console.error);