#!/usr/bin/env node

/**
 * Set VITE_SEARCH_WORKER_URL based on Cloudflare environment
 * This script runs before the build to set the correct worker URL
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get Cloudflare environment variables
const CF_PAGES_BRANCH = process.env.CF_PAGES_BRANCH;
const CF_PAGES_URL = process.env.CF_PAGES_URL;
const WORKERS_CI_BUILD_UUID = process.env.WORKERS_CI_BUILD_UUID;
const WORKERS_CI_BRANCH = process.env.WORKERS_CI_BRANCH;

let workerUrl;

// Check if we're in a Workers CI environment
if (WORKERS_CI_BUILD_UUID) {
  // Workers deployment with version/preview
  if (WORKERS_CI_BRANCH === 'main' || WORKERS_CI_BRANCH === 'master') {
    // Production worker
    workerUrl = 'https://starter-search-worker.navilan.workers.dev';
  } else {
    // Preview deployment using the UUID
    // Cloudflare Workers versions are accessible via:
    // https://<uuid>.starter-search-worker.navilan.workers.dev
    // or sometimes: https://starter-search-worker-<uuid>.navilan.workers.dev
    workerUrl = `https://${WORKERS_CI_BUILD_UUID}.starter-search-worker.navilan.workers.dev`;
  }
} else if (CF_PAGES_URL) {
  // Pages deployment - use the Pages URL with /api path
  // This assumes the worker is deployed alongside Pages or accessible via /api
  workerUrl = `${CF_PAGES_URL}/api`;
} else {
  // Local development fallback
  workerUrl = process.env.VITE_SEARCH_WORKER_URL || 'http://localhost:8788/api';
}

// Set the environment variable for Vite
process.env.VITE_SEARCH_WORKER_URL = workerUrl;

console.log(`Build configuration:
  Pages Branch: ${CF_PAGES_BRANCH || 'N/A'}
  Pages URL: ${CF_PAGES_URL || 'N/A'}
  Workers Branch: ${WORKERS_CI_BRANCH || 'N/A'}
  Workers UUID: ${WORKERS_CI_BUILD_UUID || 'N/A'}
  Worker URL: ${workerUrl}
`);

// Write to .env file for Vite to pick up
const envContent = `VITE_SEARCH_WORKER_URL=${workerUrl}\n`;
fs.writeFileSync(path.join(__dirname, '..', '.env.production'), envContent);