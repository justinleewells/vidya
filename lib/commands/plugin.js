import fs from 'fs/promises'
import { existsSync } from 'fs'
import { findBaseDir, renderTemplate, toPascalCase } from '../utils.js'

const create = async (type, name) => {
  const baseDir = await findBaseDir()
  const pluginDir = `${baseDir}/src/plugins/${name}`
  const filePath = `${pluginDir}/plugin.js`
  if (existsSync(filePath)) throw new Error('Plugin already exists.')
  await fs.mkdir(pluginDir)
  const pluginName = toPascalCase(name) + 'Plugin'
  const rendered = await renderTemplate(`${type}-plugin`, { name, pluginName })
  await fs.writeFile(filePath, rendered)
}

export default { create }
