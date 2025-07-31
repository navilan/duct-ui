#!/usr/bin/env node

import { Command } from 'commander'
import { buildCommand } from './commands/build.js'
import { ssgCommand } from './commands/ssg.js'

const program = new Command()

program
  .name('duct')
  .description('Duct UI CLI - Build and deploy Duct UI applications')
  .version('0.0.1')

// Add commands
program.addCommand(buildCommand)
program.addCommand(ssgCommand)

program.parse()