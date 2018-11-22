const RC = require('rc')('MAIL_NOTIF', require('../../config/config.json'))
const camelCase = (require('camelcase'))

const camelCaseObjectKeys = (object) => {
  for (let key in object) {
    if (key !== 'KAFKA') {
      if (typeof object[key] === 'object') object[camelCase(key)] = camelCaseObjectKeys(object[key])
      else object[camelCase([key])] = object[key]
      delete object[key]
    }
  }
  return object
}

let result = camelCaseObjectKeys(RC)

module.exports = {
  RC: result
}
