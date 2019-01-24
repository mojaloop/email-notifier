'use strict'

const fs = require('fs')
const { promisify } = require('util')
const readDirPromise = promisify(fs.readdir)
const readFilePromise = promisify(fs.readFile)

const getTemplateNamesByType = async (path, type) => {
  try {
    const directoryList = await readDirPromise(`${__dirname}/${path}`)
    let names = directoryList.filter(filename => {
      if (filename.split('.')[1] === type) {
        return filename
      }
    })
    if (names.length) return { path, names }
    else throw new Error('No such template type')
  } catch (e) {
    throw e
  }
}

const loadTemplates = async ({ path, names }) => {
  try {
    let result = {}
    for (let name of names) {
      let content = await readFilePromise(`${__dirname}/${path}/${name}`, { encoding: 'utf8' })
      if (content) result[name.split('.')[0]] = content
    }
    if (Object.keys(result).length) return result
    else throw new Error(`Templates cannot be loaded`)
  } catch (e) {
    throw e
  }
}

module.exports.loadTemplates = async (path, type) => {
  try {
    let result = await loadTemplates(await getTemplateNamesByType(path, type))
    return result
  } catch (e) {
    throw e
  }
}
