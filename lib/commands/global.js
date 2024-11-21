import fs from 'fs/promises'
import { existsSync } from 'fs'
import { findBaseDir, renderTemplate, toPascalCase } from '../utils.js'

const create = async (name) => {
  const baseDir = await findBaseDir()
  const filePath = `${baseDir}/src/globals/${name}.js`
  if (existsSync(filePath)) throw new Error('Global already exists.')
  const className = toPascalCase(name)
  const rendered = await renderTemplate('global', { className })
  await fs.writeFile(filePath, rendered)
}

export default { create }
