#!/usr/bin/env node

import { program } from 'commander'
import { readFile } from 'fs/promises'

import bootstrap from './lib/bootstrap.js'
import create from './lib/create.js'
import rename from './lib/rename.js'
import sync from './lib/sync.js'

const { version } = JSON.parse(await readFile('./package.json'))

program
  .name('vidya')
  .description('CLI for creating video games with JavaScript')
  .version(version)

program
  .command('bootstrap')
  .description('create a new vidya project')
  .argument('<name>', 'name of the new project')
  .action(bootstrap)

program
  .command('create')
  .description('create a new game object')
  .argument('<type>', 'type of game object to create')
  .argument('<name>', 'name of the new game object')
  .action(create)

program
  .command('rename')
  .description('rename a game object and its associated files')
  .argument('<type>', 'type of game object to rename')
  .argument('<current>', 'current name of the game object')
  .argument('<new>', 'new name of the game object')
  .action(rename)

program
  .command('sync')
  .description('synchronize existing game objects with config')
  .action(sync)

program.parse()
