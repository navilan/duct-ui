#!/usr/bin/env node

import { Command } from 'commander'
import { buildCommand } from './commands/build.js'

const program = new Command()

program
  .name('duct')
  .description('Duct UI CLI')
  .version('0.1.0')

program.addCommand(buildCommand)

program.parse()