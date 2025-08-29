#!/usr/bin/env node

import { Command } from 'commander'
import { generateWorkerTemplates } from './worker-generator.js'
import * as path from 'path'

const program = new Command()

program
  .name('duct-cf-search')
  .description('Duct Cloudflare Search CLI - Generate worker templates for Duct UI search')
  .version('0.1.0')

program
  .command('init')
  .description('Generate Cloudflare Worker templates for search functionality')
  .option('-o, --output <dir>', 'Output directory', './worker')
  .option('-n, --name <name>', 'Project name', 'search')
  .action(async (options) => {
    const outputDir = path.resolve(process.cwd(), options.output)
    
    console.log('🚀 Generating Cloudflare Worker templates...')
    console.log(`📁 Output directory: ${outputDir}`)
    console.log(`📝 Project name: ${options.name}`)
    console.log('')
    
    try {
      await generateWorkerTemplates({
        outputDir,
        projectName: options.name
      })
    } catch (error) {
      console.error('❌ Failed to generate templates:', error)
      process.exit(1)
    }
  })

program.parse()