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
    sandbox.stub(Consumer, 'getConsumer')
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

    brokerTest.test('broker test fails when one consumer is not healthy', async test => {
      // Arrange
      Consumer.getListOfTopics.returns(['admin1', 'admin2'])
      const mockConsumer = { isHealthy: sandbox.stub().resolves(false) }
      Consumer.getConsumer.returns(mockConsumer)
      const expected = { name: serviceName.broker, status: statusEnum.DOWN }

      // Act
      const result = await getSubServiceHealthBroker()

      // Assert
      test.deepEqual(result, expected, 'getSubServiceHealthBroker should match expected result')
      test.end()
    })

    brokerTest.test('broker test fails when getConsumer throws', async test => {
      // Arrange
      Consumer.getListOfTopics.returns(['admin1', 'admin2'])
      Consumer.getConsumer.throws(new Error('No consumer found'))
      const expected = { name: serviceName.broker, status: statusEnum.DOWN }

      // Act
      const result = await getSubServiceHealthBroker()

      // Assert
      test.deepEqual(result, expected, 'getSubServiceHealthBroker should match expected result')
      test.end()
    })

    brokerTest.test('broker test fails when isHealthy throws', async test => {
      // Arrange
      Consumer.getListOfTopics.returns(['admin1', 'admin2'])
      const mockConsumer = { isHealthy: sandbox.stub().rejects(new Error('Health check failed')) }
      Consumer.getConsumer.returns(mockConsumer)
      const expected = { name: serviceName.broker, status: statusEnum.DOWN }

      // Act
      const result = await getSubServiceHealthBroker()

      // Assert
      test.deepEqual(result, expected, 'getSubServiceHealthBroker should match expected result')
      test.end()
    })

    brokerTest.test('Passes when all consumers are healthy', async test => {
      // Arrange
      Consumer.getListOfTopics.returns(['admin1', 'admin2'])
      const mockConsumer = { isHealthy: sandbox.stub().resolves(true) }
      Consumer.getConsumer.returns(mockConsumer)
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
