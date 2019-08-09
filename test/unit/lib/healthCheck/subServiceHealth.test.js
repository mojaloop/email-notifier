'use strict'

const Test = require('tapes')(require('tape'))
const Sinon = require('sinon')
const { statusEnum, serviceName } = require('@mojaloop/central-services-shared').HealthCheck.HealthCheckEnums

const Mailer = require('../../../../src/nodeMailer/sendMail')
const Consumer = require('../../../../src/lib/kafka/consumer')
const {
  getSubServiceHealthBroker,
  getSubServiceHealthSMTP
} = require('../../../../src/lib/healthCheck/subServiceHealth')

const mailer = Mailer.sharedInstance()

Test('SubServiceHealth test', function (subServiceHealthTest) {
  let sandbox

  subServiceHealthTest.beforeEach(t => {
    sandbox = Sinon.createSandbox()
    sandbox.stub(Consumer, 'getListOfTopics')
    sandbox.stub(Consumer, 'isConnected')
    sandbox.stub(mailer.transporter, 'verify')

    t.end()
  })

  subServiceHealthTest.afterEach(t => {
    sandbox.restore()

    t.end()
  })

  subServiceHealthTest.test('getSubServiceHealthSMTP', smtpTest => {
    smtpTest.test('passes when transporter.verify() suceeds', async test => {
      // Arrange
      mailer.transporter.verify.resolves()
      const expected = { name: serviceName.smtpServer, status: statusEnum.OK }

      // Act
      const result = await getSubServiceHealthSMTP()

      // Assert
      test.deepEqual(result, expected, 'getSubServiceHealthSMTP should match expected result')
      test.end()
    })

    smtpTest.test('fails when transporter.verify() fails', async test => {
      // Arrange
      mailer.transporter.verify.throws(new Error('Authentication failed'))
      const expected = { name: serviceName.smtpServer, status: statusEnum.DOWN }

      // Act
      const result = await getSubServiceHealthSMTP()

      // Assert
      test.deepEqual(result, expected, 'getSubServiceHealthSMTP should match expected result')
      test.end()
    })

    smtpTest.end()
  })

  subServiceHealthTest.test('getSubServiceHealthBroker', brokerTest => {
    brokerTest.test('broker test passes when there are no topics', async test => {
      // Arrange
      Consumer.getListOfTopics.returns([])
      const expected = { name: serviceName.broker, status: statusEnum.OK }

      // Act
      const result = await getSubServiceHealthBroker()

      // Assert
      test.deepEqual(result, expected, 'getSubServiceHealthBroker should match expected result')
      test.end()
    })

    brokerTest.test('broker test fails when one broker cannot connect', async test => {
      // Arrange
      Consumer.getListOfTopics.returns(['admin1', 'admin2'])
      Consumer.isConnected.throws(new Error('Not connected!'))
      const expected = { name: serviceName.broker, status: statusEnum.DOWN }

      // Act
      const result = await getSubServiceHealthBroker()

      // Assert
      test.deepEqual(result, expected, 'getSubServiceHealthBroker should match expected result')
      test.end()
    })

    brokerTest.test('Passes when it connects', async test => {
      // Arrange
      Consumer.getListOfTopics.returns(['admin1', 'admin2'])
      Consumer.isConnected.returns(Promise.resolve(true))
      const expected = { name: serviceName.broker, status: statusEnum.OK }

      // Act
      const result = await getSubServiceHealthBroker()

      // Assert
      test.deepEqual(result, expected, 'getSubServiceHealthBroker should match expected result')
      test.end()
    })

    brokerTest.end()
  })

  subServiceHealthTest.end()
})
