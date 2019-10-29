'use strict'

const fs = require('fs')
const { promisify } = require('util')
const readDirPromise = promisify(fs.readdir)
const readFilePromise = promisify(fs.readFile)

const getTemplateNamesByType = async (path, type) => {
  const directoryList = await readDirPromise(`${__dirname}/${path}`)
  const names = directoryList.filter(filename => {
    if (filename.split('.')[1] === type) {
      return filename
    }
  })
  if (names.length) return { path, names }
  else throw new Error('No such template type')
}

const loadTemplates = async ({ path, names }) => {
  const result = {}
  for (const name of names) {
    const content = await readFilePromise(`${__dirname}/${path}/${name}`, { encoding: 'utf8' })
    if (content) result[name.split('.')[0]] = content
  }
  if (Object.keys(result).length) return result
  else throw new Error('Templates cannot be loaded')
}

module.exports.loadTemplates = async (path, type) => {
  const result = await loadTemplates(await getTemplateNamesByType(path, type))
  return result
}
