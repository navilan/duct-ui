import * as fs from 'fs/promises'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export interface WorkerGeneratorConfig {
  outputDir: string
  projectName?: string
}

/**
 * Simple template rendering function
 * Replaces {{variable}} placeholders with actual values
 */
function renderTemplate(template: string, variables: Record<string, string>): string {
  let result = template
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{{${key}}}`
    result = result.replace(new RegExp(placeholder, 'g'), value)
  }
  return result
}

/**
 * Generates template files for Cloudflare Worker integration
 * Does not overwrite existing files - creates .template files instead
 */
export async function generateWorkerTemplates(config: WorkerGeneratorConfig): Promise<void> {
  const { outputDir, projectName = 'search' } = config

  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true })

  // Template variables for replacement
  const templateVars = { projectName }
  
  // Path to template files
  const templatesDir = path.resolve(__dirname, '..', 'templates')

  // Generate worker template
  const workerTemplate = await fs.readFile(path.join(templatesDir, 'search-worker.template.ts'), 'utf-8')
  const workerCode = renderTemplate(workerTemplate, templateVars)
  await fs.writeFile(path.join(outputDir, 'search-worker.template.ts'), workerCode)

  // Generate production wrangler.toml template
  const wranglerTemplate = await fs.readFile(path.join(templatesDir, 'wrangler.toml.template'), 'utf-8')
  const wranglerCode = renderTemplate(wranglerTemplate, templateVars)
  await fs.writeFile(path.join(outputDir, 'wrangler.toml.template'), wranglerCode)

  // Generate preview wrangler.toml template
  const wranglerPreviewTemplate = await fs.readFile(path.join(templatesDir, 'wrangler.preview.toml.template'), 'utf-8')
  const wranglerPreviewCode = renderTemplate(wranglerPreviewTemplate, templateVars)
  await fs.writeFile(path.join(outputDir, 'wrangler.preview.toml.template'), wranglerPreviewCode)

  // Copy sync script
  const syncScriptTemplate = await fs.readFile(path.join(templatesDir, 'sync-search-index.js'), 'utf-8')
  const syncScriptCode = renderTemplate(syncScriptTemplate, templateVars)
  await fs.writeFile(path.join(outputDir, 'sync-search-index.js'), syncScriptCode)

  // Generate integration instructions
  const readmeTemplate = await fs.readFile(path.join(templatesDir, 'SEARCH-PROVIDER-README.md.template'), 'utf-8')
  const readmeCode = renderTemplate(readmeTemplate, templateVars)
  await fs.writeFile(path.join(outputDir, 'SEARCH-PROVIDER-README.md'), readmeCode)

  console.log(`✅ Generated Cloudflare worker templates at: ${outputDir}`)
  console.log(`
Template files created:
- search-worker.template.ts (worker implementation)
- wrangler.toml.template (production configuration)
- wrangler.preview.toml.template (preview configuration)
- sync-search-index.js (search index sync script with .env support)
- SEARCH-PROVIDER-README.md (integration instructions)

No existing files were modified. Please review SEARCH-PROVIDER-README.md for integration steps.
`)
}