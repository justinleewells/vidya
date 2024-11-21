import fs from 'fs/promises'
import {
  findBaseDir,
  readMetadata,
  toEnumCase,
  toPascalCase,
  toClassName,
  renderTemplate,
} from '../utils.js'

export default async (type) => {
  const baseDir = await findBaseDir()
  const typeDir = `${baseDir}/src/types/${type}`
  const dataDir = `${typeDir}/data`
  const metadata = await readMetadata(baseDir, type)
  const plural = metadata.plural ?? type

  const data = []
  const files = await fs.readdir(dataDir)
  for (let i = 0; i < files.length; i++) {
    if (files[i] === 'index.js') continue
    if (files[i] === 'database.js') continue

    const filename = files[i]
    const file = (await fs.readFile(`${dataDir}/${filename}`)).toString()

    // Search for an id
    const idMatch = file.match(/id: (.*?),/)
    if (idMatch === null)
      throw new Error(`Failed to find an id in: ${filename}`)

    // Search for a name
    const nameMatch = file.match(/name: ['|"](.*?)['|"],/)
    if (nameMatch === null)
      throw new Error(`Failed to find a name in: ${filename}`)

    const name = nameMatch[1]
    data.push({
      filename,
      id: idMatch[1],
      key: toEnumCase(name),
      className: toClassName(metadata, name),
    })
  }

  // Sort the entries so the files are pleasing to view
  data.sort((a, b) => a.id - b.id)

  // Create the enum
  if (metadata.enum) {
    const rendered = await renderTemplate('enum', { data })
    await fs.writeFile(`${baseDir}/src/enums/${plural}.js`, rendered)
  }

  // Create the index
  if (metadata.index) {
    const rendered = await renderTemplate('index', { data })
    await fs.writeFile(`${typeDir}/index.js`, rendered)
  }

  // Create the database
  if (metadata.database) {
    const rendered = await renderTemplate('database', {
      data,
      plural,
      enum: metadata.enum,
      enumFile: plural,
      enumName: toPascalCase(plural),
    })
    await fs.writeFile(`${typeDir}/database.js`, rendered)
  }

  // Create the factory
  if (metadata.factory) {
    const rendered = await renderTemplate('factory', {
      data,
      plural,
      enum: metadata.enum,
      enumFile: plural,
      enumName: toPascalCase(plural),
      typeName: toPascalCase(type),
    })
    await fs.writeFile(`${typeDir}/factory.js`, rendered)
  }
}
