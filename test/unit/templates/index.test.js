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

 - Shashikant Hirugade <shashikant.hirugade@modusbox.com>
 --------------
 ******/

'use strict'

const Sinon = require('sinon')
const Templates = require('../../../templates/index')
const Test = require('tapes')(require('tape'))
const fs = require('fs')
const { promisify } = require('util')
const readFilePromise = promisify(fs.readFile)

Test('Templates unit tests (Index.js) : ', async templateTest => {
  let sandbox
  templateTest.beforeEach(t => {
    // create a sandbox
    sandbox = Sinon.createSandbox()
    // start stubbing stuff
    t.end()
  })

  templateTest.afterEach(t => {
    // restore the environment as it was before
    sandbox.restore()
    t.end()
  })

  await templateTest.test(' getTemplateNamesByType should throw an error when incorrect path is given.', async assert => {
    try {
      await Templates.loadTemplates('/test', 'mustache')
      assert.fail('should throw')
      assert.end()
    } catch (e) {
      assert.ok(e instanceof Error)
      assert.end()
    }
  })

  await templateTest.test('Load templates should throw an error if template is empty or cannot be loaded.', async assert => {
    try {
      await Templates.loadTemplates('../test/unit/templates', 'mustache')
      assert.fail('should throw')
      assert.end()
    } catch (e) {
      assert.equal(e.message, 'Templates cannot be loaded')
      assert.end()
    }
  })

  await templateTest.test('Load templates should throw an error if template is incorrect or missing type is given.', async assert => {
    try {
      await Templates.loadTemplates('../test/unit/templates', 'wrong')
      assert.fail('should throw')
      assert.end()
    } catch (e) {
      assert.equal(e.message, 'No such template type')
      assert.end()
    }
  })

  await templateTest.test('Load templates should load test template.', async assert => {
    try {
      const okTemplate = await readFilePromise(`${__dirname}/ok.template`, { encoding: 'utf8' })
      const result = await Templates.loadTemplates('../test/unit/templates', 'template')
      assert.equal(result.ok, okTemplate)
      assert.end()
    } catch (e) {
      assert.fail('error was thrown')
      assert.end()
    }
  })

  await templateTest.end()
})
