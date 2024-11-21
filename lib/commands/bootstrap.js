import { execSync } from 'child_process'
import fs from 'fs/promises'

export default async function bootstrap(name) {
  const basePath = `./${name}`
  execSync(`git clone git@github.com:justinleewells/vidya-seed.git ${basePath}`)
  await fs.rm(`${basePath}/.git`, { recursive: true, force: true })
  const packageJson = JSON.parse(
    (await fs.readFile(`${basePath}/package.json`)).toString()
  )
  packageJson.name = name
  packageJson.description = 'A game created using the vidya framework.'
  await fs.writeFile(
    `${basePath}/package.json`,
    JSON.stringify(packageJson, null, 2)
  )
  execSync(`cd ${basePath} && npm install`)
}
