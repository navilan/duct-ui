import { Command } from 'commander'
import * as logger from '../logger.js'

export const ssgCommand = new Command('ssg')
  .description('Generate static pages (placeholder for future implementation)')
  .action(() => {
    logger.info('SSG command - to be implemented')
  })