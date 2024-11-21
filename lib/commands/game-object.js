import fs from 'fs/promises'
import { existsSync } from 'fs'
import { findBaseDir, renderTemplate, toPascalCase } from '../utils.js'

const create = async (name) => {
  const baseDir = await findBaseDir()
  const filePath = `${baseDir}/src/game-objects/${name}.js`
  if (existsSync(filePath)) throw new Error('Game Object already exists.')
  const className = toPascalCase(name)
  const objectName =
    className[0].toLowerCase() + className.slice(1, className.length)
  const view = { name, className, objectName }
  const rendered = await renderTemplate('game-object', view)
  await fs.writeFile(filePath, rendered)
}

export default { create }
