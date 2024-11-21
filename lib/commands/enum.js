import fs from 'fs/promises'
import { existsSync } from 'fs'
import { findBaseDir, renderTemplate, toPascalCase } from '../utils.js'

const create = async (name) => {
  const baseDir = await findBaseDir()
  const filePath = `${baseDir}/src/enums/${name}.js`
  if (existsSync(filePath)) throw new Error('Enum already exists.')
  const rendered = await renderTemplate('enum', {})
  await fs.writeFile(filePath, rendered)
}

export default { create }
