import fs from 'fs/promises'
import { existsSync } from 'fs'
import {
  findBaseDir,
  readMetadata,
  renderTemplate,
  renderType,
  toEnumCase,
  toPascalCase,
  toTitleCase,
  toClassName,
} from '../utils.js'
import sync from './sync.js'

const create = async (type, name, options) => {
  const baseDir = await findBaseDir()
  const typeDir = `${baseDir}/src/types/${type}`
  const dataDir = `${typeDir}/data`
  const metadata = await readMetadata(baseDir, type)

  // Make sure the data doesn't exist
  if (existsSync(`${dataDir}/${name}.js`))
    throw new Error('Data already exists. Aborting')

  // Create the data file
  const view = {
    type,
    id: metadata.nextId++,
    name: toTitleCase(name),
    className: toClassName(metadata, name),
    typeName: toPascalCase(type),
  }
  const dataFile = await renderType(
    baseDir,
    type,
    `${options.template}.mustache`,
    view
  )
  await fs.writeFile(`${dataDir}/${name}.js`, dataFile)

  // Record metadata's nextId
  await fs.writeFile(
    `${typeDir}/metadata.json`,
    JSON.stringify(metadata, null, 2)
  )

  // We can exit if there aren't any extra objects to maintain
  if (!metadata.enum && !metadata.index && !metadata.database) return

  await sync(type)
}

const rename = async (type, oldFilename, newFilename) => {
  const baseDir = await findBaseDir()
  const dataDir = `${baseDir}/src/types/${type}/data`
  const metadata = await readMetadata(baseDir, type)

  // Read the old data file
  let file = (await fs.readFile(`${dataDir}/${oldFilename}.js`)).toString()

  // Try to replace as many differences as possible. This isn't guaranteed
  // to work since I might have manually doctored the data's name, but it's
  // worth a try.
  const oldName = toTitleCase(oldFilename)
  const newName = toTitleCase(newFilename)
  const oldClassName = toClassName(metadata, oldName)
  const newClassName = toClassName(metadata, newName)
  file = file
    .replaceAll(oldFilename, newFilename)
    .replaceAll(oldName, newName)
    .replaceAll(oldClassName, newClassName)

  // Delete the old file
  await fs.unlink(`${dataDir}/${oldFilename}.js`)

  // We can exit if there aren't any extra objects to maintain
  if (!metadata.enum && !metadata.index && !metadata.database) return

  // Synchronize the data
  await sync(type)

  // Write the new file after the synchronization so it doesn't cause
  // webpack to throw a fit.
  await fs.writeFile(`${dataDir}/${newFilename}.js`, file, { flush: true })
}

export default { create, rename }
