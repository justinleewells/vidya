import fs from 'fs/promises'
import { existsSync } from 'fs'
import { dirname, findBaseDir, renderTemplate, toPascalCase } from '../utils.js'

const create = async (name, options) => {
  const baseDir = await findBaseDir()
  const typeDir = `${baseDir}/src/types/${name}`

  // Make sure the type doesn't already exist
  if (existsSync(typeDir)) throw new Error('Type already exists. Aborting.')

  // Create the directories
  const dataDir = `${typeDir}/data`
  await fs.mkdir(dataDir, { recursive: true })
  const templateDir = `${typeDir}/templates`
  await fs.mkdir(templateDir, { recursive: true })

  // Create the metadata file
  const metadata = {
    nextId: 0,
    enum: options.enum ?? true,
    index: options.index ?? false,
    database: options.database ?? false,
    factory: options.factory ?? false,
    className: `$name`,
    plural: options.plural ?? name,
  }
  await fs.writeFile(
    `${typeDir}/metadata.json`,
    JSON.stringify(metadata, null, 2)
  )

  // Create the default template
  await fs.copyFile(
    `${dirname(import.meta.url)}/../../templates/default.mustache`,
    `${templateDir}/default.mustache`
  )

  // Create the base class
  const rendered = await renderTemplate('type', {
    typeName: toPascalCase(name),
  })
  await fs.writeFile(`${typeDir}/${name}.js`, rendered)
}

export default { create }
