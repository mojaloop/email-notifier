/*****
 License
 --------------
 Copyright © 2017 Bill & Melinda Gates Foundation
 The Mojaloop files are made available by the Bill & Melinda Gates Foundation
 under the Apache License, Version 2.0 (the "License") and you may not use these
 files except in compliance with the License. You may obtain a copy of the
 License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, the Mojaloop files
 are distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied. See the License for the specific language
 governing permissions and limitations under the License.

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

 - Shashikant Hirugade <shashikant.hirugade@modusbox.com>
 - JJ Geewax <jjg@google.com>
 --------------
 ******/

'use strict'

const fs = require('fs')
const Sinon = require('sinon')

const Templates = require('../../../templates/index')

describe('Templates', () => {
  let sandbox

  beforeEach(() => {
    sandbox = Sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('getTemplateNamesByType', () => {
    it('should throw an error when incorrect path is given', async () => {
      await expect(Templates.loadTemplates('/test', 'mustache'))
        .rejects.toThrow()
    })
  })

  describe('Load templates', () => {
    it('should throw an error if template is empty or cannot be loaded', async () => {
      await expect(Templates.loadTemplates('../test/unit/templates', 'mustache'))
        .rejects.toThrow('Templates cannot be loaded')
    })

    it('should throw an error if template is incorrect or missing type is given', async () => {
      await expect(Templates.loadTemplates('../test/unit/templates', 'wrong'))
        .rejects.toThrow('No such template type')
    })

    it('should load test template', async () => {
      const okTemplatePath = `${__dirname}/ok.template`
      const okTemplate = fs.readFileSync(okTemplatePath, { encoding: 'utf8' })
      const result = await Templates.loadTemplates('../test/unit/templates', 'template')
      expect(result).toEqual({
        ok: okTemplate
      })
    })
  })
})
