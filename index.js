import { program } from 'commander'

import data from './lib/commands/data.js'
import enu from './lib/commands/enum.js' // enum is a reserved word :(
import gameObject from './lib/commands/game-object.js'
import global from './lib/commands/global.js'
import plugin from './lib/commands/plugin.js'
import bootstrap from './lib/commands/bootstrap.js'
import scene from './lib/commands/scene.js'
import sync from './lib/commands/sync.js'
import type from './lib/commands/type.js'

const commandNye = () => {
  throw new Error('Command not yet implemented.')
}

// Program
program
  .name('vidya')
  .description('CLI for creating video games with JavaScript')

// Bootstrap
program
  .command('bootstrap')
  .argument('<name>', 'the name of the game')
  .action(bootstrap)

// Create
const create = program.command('create').alias('c')
create
  .command('type')
  .alias('t')
  .argument('<name>', 'name of the new type in kebab case')
  .option('--no-enum', 'removes the enum')
  .option('-i, --index', 'maintains an index')
  .option('-db, --database', 'maintains a database')
  .option('-f, --factory', 'maintains a factory')
  .option('-p, --plural <word>', 'the plural word for this type')
  .action(type.create)
create
  .command('data')
  .alias('d')
  .argument('<type>', 'the type of data to create')
  .argument('<name>', 'name of the new data in kebab case')
  .option('-t, --template <string>', 'template to render', 'default')
  .action(data.create)
create
  .command('game-object')
  .alias('go')
  .argument('<name>', 'name of the new game object in kebab case')
  .action(gameObject.create)
create.command('scene').alias('s').argument('<name>').action(scene.create)
create.command('global').alias('g').argument('<name>').action(global.create)
create
  .command('plugin')
  .alias('p')
  .argument('<type>', 'either scene or global')
  .argument('<name>', 'the name of the plugin')
  .action(plugin.create)
create
  .command('enum')
  .alias('e')
  .argument('<name>', 'the name of the enum')
  .action(enu.create)

// Sync
program
  .command('sync')
  .alias('s')
  .argument('<type>', 'the type to synchronize')
  .action(sync)

// Rename
program
  .command('rename')
  .alias('r')
  .argument('<type>', 'the type of data to rename')
  .argument('<old-filename>', 'the current name of the file to rename')
  .argument('<new-filename>', 'the new name of the file')
  .action(data.rename)

program.parse()
