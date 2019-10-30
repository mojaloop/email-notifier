const sinon = require('sinon')
const Rx = require('rxjs')

describe('Setup', () => {
  let sandbox,
    Setup

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    Setup = require('../../src/setup')
  })

  afterEach(() => {
    jest.resetModules()
    sandbox.restore()
  })

  describe('setup', () => {
    beforeEach(() => {
      sandbox.stub(Setup, 'registerNotificationHandler')
      sandbox.stub(Setup, 'getHealthCheck')
      sandbox.stub(Setup, 'getConsumer')
      sandbox.stub(Setup, 'createHealthCheckServer').resolves()
      sandbox.stub(Setup, 'getTopicObservable').returns(Rx.Observable.create())
    })

    it('setup should make various function calls', async () => {
      expect(await Setup.setup()).toBe(true)
      expect(Setup.createHealthCheckServer.calledOnce).toBe(true)
      expect(Setup.getHealthCheck.calledOnce).toBe(true)
      expect(Setup.getTopicObservable.calledOnce).toBe(true)
    })
  })

  describe('get topicName', () => {
    it('should return a vaild general topic name', () => {
      expect(Setup.topicName).toEqual('topic-notification-event')
    })

    it('should cache and return the cached result', () => {
      Setup._topicName = 'test-topic'
      expect(Setup.topicName).toEqual(Setup._topicName)
    })
  })

  describe('getConsumer', () => {
    it('should return try to return the consumer for the default topic name', () => {
      expect(() => {
        Setup.getConsumer()
      }).toThrow('No consumer found for topic')
    })

    it('should accept different topic names', () => {
      const topicName = 'different-topic-name'
      expect(() => {
        Setup.getConsumer(topicName)
      }).toThrow(`No consumer found for topic ${topicName}`)
    })
  })

  describe('getHealthCheck', () => {
    let shared

    beforeEach(() => {
      jest.resetModules()
      jest.mock('@mojaloop/central-services-shared')
      shared = require('@mojaloop/central-services-shared')
      Setup = require('../../src/setup')
    })

    it('should try to create a new Healthcheck', () => {
      expect(shared.HealthCheck.HealthCheck).toHaveBeenCalledTimes(0)
      Setup.getHealthCheck()
      expect(shared.HealthCheck.HealthCheck).toHaveBeenCalledTimes(1)
    })
  })

  describe('createHealthCheckServer', () => {
    let health

    beforeEach(() => {
      jest.resetModules()
      jest.mock('@mojaloop/central-services-health')
      health = require('@mojaloop/central-services-health')
      Setup = require('../../src/setup')
    })

    it('should use the default healthcheck', async () => {
      const healthCheck = Symbol('healthcheck')
      sandbox.stub(Setup, 'getHealthCheck').returns(healthCheck)
      expect(health.defaultHealthHandler).toHaveBeenCalledTimes(0)
      Setup.createHealthCheckServer()
      expect(health.defaultHealthHandler).toHaveBeenCalledTimes(1)
      expect(health.defaultHealthHandler).toHaveBeenCalledWith(healthCheck)
    })

    it('should use the healthcheck provided if not null', () => {
      const healthCheck = Symbol('healthcheck')
      sandbox.spy(Setup, 'getHealthCheck')
      expect(health.defaultHealthHandler).toHaveBeenCalledTimes(0)
      expect(Setup.getHealthCheck.called).toBe(false)
      Setup.createHealthCheckServer(healthCheck)
      expect(health.defaultHealthHandler).toHaveBeenCalledTimes(1)
      expect(health.defaultHealthHandler).toHaveBeenCalledWith(healthCheck)
    })

    it('should create a health check server', () => {
      expect(health.createHealthCheckServer).toHaveBeenCalledTimes(0)
      Setup.createHealthCheckServer()
      expect(health.createHealthCheckServer).toHaveBeenCalledTimes(1)
    })
  })

  describe('getTopicObservable', () => {
    let Consumer
    let getConsumerStub
    let shared

    beforeEach(() => {
      jest.resetModules()
      jest.mock('@mojaloop/central-services-shared')
      shared = require('@mojaloop/central-services-shared')
      jest.mock('../../src/lib/kafka/consumer')
      Consumer = require('../../src/lib/kafka/consumer')
      Setup = require('../../src/setup')

      getConsumerStub = {
        on: sinon.spy(),
        commitMessageSync: sinon.spy()
      }
      sandbox.stub(Setup, 'getConsumer').returns(getConsumerStub)
    })

    it('should use the default topic name if none provided', () => {
      Setup.getTopicObservable()
      expect(Setup.getConsumer.called).toBe(true)
      const calledTopicName = Setup.getConsumer.lastCall.args[0]
      expect(calledTopicName).toEqual(Setup.topicName)
    })

    it('should use the topic name if provided', () => {
      const topicName = 'provided-topic-name'
      Setup.getTopicObservable(topicName)
      expect(Setup.getConsumer.called).toBe(true)
      const calledTopicName = Setup.getConsumer.lastCall.args[0]
      expect(calledTopicName).toEqual(topicName)
    })

    it('should register a listener on the consumer', () => {
      expect(getConsumerStub.on.called).toBe(false)
      Setup.getTopicObservable().subscribe(() => {})
      expect(getConsumerStub.on.called).toBe(true)
    })

    it('should call Logger.info when messages arrive', () => {
      Setup.getTopicObservable().subscribe(() => {})
      expect(getConsumerStub.on.called).toBe(true)

      expect(shared.Logger.info).toHaveBeenCalledTimes(0)
      const onMessage = getConsumerStub.on.lastCall.args[1]
      onMessage({ value: 'test' })
      expect(shared.Logger.info).toHaveBeenCalledTimes(1)
    })

    it('should call commitMessageSync if auto commit is disabled', () => {
      Setup.getTopicObservable().subscribe(() => {})
      expect(getConsumerStub.on.called).toBe(true)
      const onMessage = getConsumerStub.on.lastCall.args[1]
      expect(Consumer.isConsumerAutoCommitEnabled).toHaveBeenCalledTimes(0)
      expect(getConsumerStub.commitMessageSync.called).toBe(false)
      Consumer.isConsumerAutoCommitEnabled.mockReturnValue(false)
      onMessage({ value: 'test' })
      expect(Consumer.isConsumerAutoCommitEnabled).toHaveBeenCalledTimes(1)
      expect(getConsumerStub.commitMessageSync.called).toBe(true)
    })

    it('should not call commitMessageSync if auto commit is enabled', () => {
      Setup.getTopicObservable().subscribe(() => {})
      expect(getConsumerStub.on.called).toBe(true)
      const onMessage = getConsumerStub.on.lastCall.args[1]
      expect(Consumer.isConsumerAutoCommitEnabled).toHaveBeenCalledTimes(0)
      expect(getConsumerStub.commitMessageSync.called).toBe(false)
      Consumer.isConsumerAutoCommitEnabled.mockReturnValue(true)
      onMessage({ value: 'test' })
      expect(Consumer.isConsumerAutoCommitEnabled).toHaveBeenCalledTimes(1)
      expect(getConsumerStub.commitMessageSync.called).toBe(false)
    })
  })

  describe('registerNotificationHandler', () => {
    let Consumer

    beforeEach(() => {
      jest.resetModules()
      jest.mock('../../src/lib/kafka/consumer')
      Consumer = require('../../src/lib/kafka/consumer')
      Setup = require('../../src/setup')
    })

    it('should call Consumer.registerNotificationHandler()', () => {
      expect(Consumer.registerNotificationHandler).toHaveBeenCalledTimes(0)
      Setup.registerNotificationHandler()
      expect(Consumer.registerNotificationHandler).toHaveBeenCalledTimes(1)
    })
  })
})
