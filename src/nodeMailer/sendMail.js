/*****
 License
 --------------
 Copyright © 2017 Bill & Melinda Gates Foundation
 The Mojaloop files are made available by the Bill & Melinda Gates Foundation under the Apache License, Version 2.0 (the "License") and you may not use these files except in compliance with the License. You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, the Mojaloop files are distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 Contributors
 --------------
 This is the official list of the Mojaloop project contributors for this file.
 Names of the original copyright holders (individuals or organizations)
 should be listed with a '*' in the first column. People who have
 contributed from an organization can be listed under the organization
 that actually holds the copyright for their contributions (see the
 Gates Foundation organization for an example). Those individuals should have
 their names indented and be marked with a '-'. Email address can be added
 optionally within square brackets <email>.
 * Gates Foundation
 - Name Surname <name.surname@gatesfoundation.com>
 * Rajiv Mothilal <rajiv.mothilal@modusbox.com>
 * Miguel de Barros <miguel.debarros@modusbox.com>
 * Lewis Daly <lewis@vesselstech.com>
 --------------
 ******/

'use strict'

/**
 * @module src/nodeMailer/sendMail
 */

const Nodemailer = require('nodemailer')
const Config = require('../lib/config')
const MailOptions = Config.get('emailSettings').smtpConfig

let sharedInstance = null

class Mailer {
  constructor (options = MailOptions) {
    this.transporter = Nodemailer.createTransport(options)
  }

  static sharedInstance() {
    if (!sharedInstance) {
      sharedInstance = new Mailer()
    }

    return sharedInstance
  } 

  async sendMailMessage (message) {
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(message, (error, info) => {
        if (error) {
          return reject(error)
        }

        return resolve({
          emailSent: info.response
        })
      })
    })
  }
}

// let transporter

/* let verifyEmailTransport = () => {
  return new Promise((resolve, reject) => {
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error)
      } else {
        console.log('Mail server ready to take messages')
      }
    })
  })
} */

// let sendMailMessage = async (message) => {
//   if (!transporter) {
//     transporter = await Nodemailer.createTransport(MailOptions)
//   }
//   return new Promise((resolve, reject) => {
//     transporter.sendMail(message, (error, info) => {
//       if (error) {
//         reject(error)
//       } else {
//         console.log('else hit')
//         resolve({
//           emailSent: info.response
//         })
//       }
//     })
//   })
// }

module.exports = Mailer
