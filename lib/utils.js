import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import prettier from 'prettier'
import Mustache from 'mustache'

const dirname = (url) => path.dirname(fileURLToPath(url))

const findBaseDir = async () => {
  let current = process.env.PWD
  while (current.length > 0) {
    let files = await fs.readdir(current)
    for (let i = 0; i < files.length; i++) {
      if (files[i] != 'vidya.json') continue
      return current
    }
    let spl = current.split('/')
    current = spl.slice(0, spl.length - 1).join('/')
  }
  throw new Error('Failed to find vidya.json.')
}

const readMetadata = async (baseDir, type) => {
  const path = `${baseDir}/src/types/${type}/metadata.json`
  return JSON.parse((await fs.readFile(path)).toString())
}

const renderTemplate = async (templateName, view) => {
  const dir = dirname(import.meta.url)
  const template = (
    await fs.readFile(`${dir}/../templates/${templateName}.mustache`)
  ).toString()
  const rendered = Mustache.render(template, view)
  const config = JSON.parse(
    (await fs.readFile(`${dir}/../.prettierrc.json`)).toString()
  )
  config.parser = 'babel'
  return await prettier.format(rendered, config)
}

const renderType = async (baseDir, type, template, view) => {
  const file = (
    await fs.readFile(`${baseDir}/src/types/${type}/templates/${template}`)
  ).toString()
  const rendered = Mustache.render(file, view)
  const config = JSON.parse(
    (await fs.readFile(`${baseDir}/.prettierrc.json`)).toString()
  )
  config.parser = 'babel'
  return await prettier.format(rendered, config)
}

const toKebabCase = (str) =>
  str.replace(' ', '-').replace("'", '').toLowerCase()

const toPascalCase = (str) =>
  str
    .replaceAll(' ', '')
    .split('-')
    .map((w) => w.replace(/^\w/, (c) => c.toUpperCase()))
    .join('')

const toTitleCase = (str) =>
  str
    .split('-')
    .map((w) => w.replace(/^\w/, (c) => c.toUpperCase()))
    .join(' ')

const toEnumCase = (str) =>
  str.replace(/\s|-/, '_').replace("'", '').toUpperCase()

const toClassName = (metadata, name) =>
  metadata.className.replace('$name', toPascalCase(name)).replaceAll(' ', '')

export {
  dirname,
  findBaseDir,
  readMetadata,
  renderTemplate,
  renderType,
  toKebabCase,
  toPascalCase,
  toTitleCase,
  toEnumCase,
  toClassName,
}
