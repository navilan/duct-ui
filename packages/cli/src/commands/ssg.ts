import { Command } from 'commander'

export const ssgCommand = new Command('ssg')
  .description('Generate static pages (placeholder for future implementation)')
  .action(() => {
    console.log('SSG command - to be implemented')
  })