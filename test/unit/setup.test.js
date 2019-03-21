const Sinon = require('sinon')
const Test = require('tapes')(require('tape'))
const Proxyquire = require('proxyquire')

Test('Setup test', async setupTest => {
  let sandbox,
    setupProxy,
    subStub,
    pipeStub,
    operatorsStub,
    conStub,
    ConsumerStub,
    UtilityStub,
    RxStub,
    ObservablesStub,
    healthcheckStub

  const topicName = 'test-topic'
  setupTest.beforeEach(t => {
    try {
      sandbox = Sinon.createSandbox()

      conStub = {
        commitMessageSync: sandbox.stub().returns(async function () { return true }),
        consume: sandbox.stub().resolves(),
        _status: { running: true }
      }

      subStub = {
        subscribe: sandbox.stub().returns(true)
      }

      pipeStub = {
        pipe: sandbox.stub().returns(subStub)
      }

      RxStub = {
        Observable: {
          create: sandbox.stub().returns(pipeStub)
        }
      }

      operatorsStub = {
        filter: sandbox.stub().returns(() => {}),
        switchMap: sandbox.stub().returns(() => {})
      }

      ObservablesStub = {
        actionObservable: sandbox.stub()
      }

      healthcheckStub = sandbox.stub().returns()

      UtilityStub = {
        trantransformGeneralTopicName: sandbox.stub().returns(topicName)
      }

      ConsumerStub = {
        registerNotificationHandler: sandbox.stub().resolves(),
        isConsumerAutoCommitEnabled: sandbox.stub().returns(true),
        getConsumer: sandbox.stub().returns(conStub)
      }

      setupProxy = Proxyquire('../../src/setup', {
        'rxjs': RxStub,
        './observables': ObservablesStub,
        'healthcheck-server': healthcheckStub,
        'rxjs/operators': operatorsStub,
        './lib/utility': UtilityStub,
        './lib/kafka/consumer': ConsumerStub
      })
    } catch (e) {
      console.error(e)
    }
    t.end()
  })

  setupTest.afterEach(t => {
    sandbox.restore()
    t.end()
  })

  await setupTest.test('setup should', async assert => {
    try {
      let result = await setupProxy.setup()
      assert.ok(result, 'Notifier setup finished')
      assert.ok(healthcheckStub.calledOnce, 'healthCheck initialized')
      assert.ok(RxStub.Observable.create.calledOnce, 'Observable created')
      assert.end()
    } catch (e) {
      console.error(e)
      assert.end()
    }
  })
  setupTest.end()
})
