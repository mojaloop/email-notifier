'use strict'

const fs = require('fs')
const { promisify } = require('util')
const readDirPromise = promisify(fs.readdir)
const readFilePromise = promisify(fs.readFile)
const Path = require('path')

const getTemplateNamesByType = async (path, type) => {
  const dirPath = Path.join(__dirname, path)
  const directoryList = await readDirPromise(dirPath)
  const names = directoryList.filter(filename => {
    if (filename.split('.')[1] === type) {
      return filename
    }
    return null
  })
  if (names.length) return { path, names }
  else throw new Error('No such template type')
}

const loadTemplates = async ({ path, names }) => {
  const result = {}
  for (const name of names) {
    const dirPath = Path.join(__dirname, path, name)
    const content = await readFilePromise(dirPath, { encoding: 'utf8' })
    if (content) result[name.split('.')[0]] = content
  }
  if (Object.keys(result).length) return result
  else throw new Error('Templates cannot be loaded')
}

module.exports.loadTemplates = async (path, type) => {
  const result = await loadTemplates(await getTemplateNamesByType(path, type))
  return result
}
