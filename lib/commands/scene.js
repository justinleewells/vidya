import fs from 'fs/promises'
import { existsSync } from 'fs'
import { findBaseDir, renderTemplate, toPascalCase } from '../utils.js'

const create = async (name) => {
  const baseDir = await findBaseDir()
  const sceneDir = `${baseDir}/src/scenes/${name}`
  if (existsSync(sceneDir)) throw new Error('Scene already exists.')
  await fs.mkdir(sceneDir)
  const view = { className: toPascalCase(name) }
  const rendered = await renderTemplate('scene', view)
  await fs.writeFile(`${sceneDir}/index.js`, rendered)
}

export default { create }
