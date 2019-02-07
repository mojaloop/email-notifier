/*  HOT observeable is the topicObservable
    COLD are the rest observables */

const marbles = require('rxjs-marbles/tape').marbles
// const Sinon = require('sinon')
const Test = require('tapes')(require('tape'))
// const Setup = require('../../src/setup').setup
// const Kafka = require('../../src/lib/kafka')
// const KafkaConsumer = require('@mojaloop/central-services-stream').Kafka.Consumer
// const Rx = require('rxjs')
const { filter, switchMap } = require('rxjs/operators')

const TestScheduler = require('rxjs/testing').TestScheduler

const scheduler = new TestScheduler((actual, expected) => {

})

const Observables = require('../../src/observables/actions')
const Config = require('../../src/lib/config')
const hubName = Config.get('HUB_PARTICIPANT').NAME

Test('Test the action observables Setup', marbles((m, t) => {

  t.plan(1)

  let mockMessage = {
    'value': {
      'from': hubName,
      'to': 'dfsp1',
      'id': '694dd040-a315-4427-bcf0-e29229c4defe',
      'content': {
        'header': {},
        'payload': {
          'from': Config.get('HUB_PARTICIPANT').hubName,
          'to': 'dfsp1',
          'recepientDetails': {
            '_id': '5bf5480aa305f9801a6d59db',
            'name': 'dfsp1',
            'type': 'NET_DEBIT_CAP_ADJUSTMENT',
            'value': 'dean.bothma@modusbox.com',
            'action': 'sendEmail',
            'createdAt': '2018-11-21T11:56:58.919Z',
            'updatedAt': '2018-11-21T14:00:38.993Z',
            '__v': 0
          },
          'hubDetails': {
            '_id': '5bf5480aa305f9801a6d59dd',
            'name': 'Hub',
            'type': 'NET_DEBIT_CAP_ADJUSTMENT',
            'value': 'dean.bothma@modusbox.com',
            'action': 'sendEmail',
            'createdAt': '2018-11-21T11:56:58.950Z',
            'updatedAt': '2018-11-21T14:00:39.077Z',
            '__v': 0
          },
          'messageDetails': {
            'dfsp': 'dfsp1',
            'limitType': 'NET_DEBIT_CAP',
            'value': 1000,
            'currency': 'USD',
            'triggeredBy': '5bf5480ba305f9801a6d59e0',
            'repetitionsAllowed': 3,
            'fromEvent': '5bf5480ba305f9801a6d59e4',
            'action': 'sendEmail',
            'notificationEndpointType': 'NET_DEBIT_CAP_ADJUSTMENT',
            'templateType': 'adjustment',
            'language': 'en',
            'messageSubject': 'NET_DEBIT_CAP LIMIT ADJUSTMENT',
            'notificationInterval': 3,
            'resetPeriod': 60
          }
        }
      },
      'type': 'application/json',
      'metadata': {
        'event': {
          'id': '4276f87a-0a17-485f-acb8-f2d582a1f608',
          'responseTo': '88d15b71-ae0d-4e31-a285-c3fdd5982180',
          'type': 'notification',
          'action': 'event',
          'createdAt': '2018-12-11T13:36:58.225Z',
          'state': {'status': 'success', 'code': 0, 'description': 'action successful'}
        }, 'protocol.createdAt': 1544535418447
      },
      'pp': ''
    },
    'size': 1363,
    'key': {
      'type': 'Buffer',
      'data': [51, 48, 55, 54, 50, 51, 49, 55, 45, 54, 48, 97, 48, 45, 52, 98, 102, 52, 45, 98, 98, 97, 97, 45, 100, 50, 49, 50, 53, 101, 49, 100, 54, 52, 50, 97]
    },
    'topic': 'topic-notification-event',
    'offset': 4,
    'partition': 0,
    'timestamp': 1544535418448
  }

  const inputs = {
    a: mockMessage,
    b: {}
  }

  const source = m.cold('---a-b-|', inputs)
  const subs =          '^------!'
  const expected =      '---a---|'

  const destination = source.pipe(filter(data => data.value.from === hubName),
  switchMap(Observables.actionObservable))
  //m.expect(source).toHaveSubscriptions(subs)
  m.expect(destination).toBeObservable(expected)
  // t.end()
})) 

  // ?=> {
  // let sandbox
  // let ConsumerStub
  // let UtilityStub
  // let LoggerStub
  // let RxStub
  // let filterStub
  // let switchMapStub
  // let ObservablesStub
  // let healthcheckStub

  // setupTest.beforeEach(t => {
  //   sandbox = Sinon.createSandbox()
  //   sandbox.stub(KafkaConsumer.prototype, 'constructor').resolves()
  //   sandbox.stub(KafkaConsumer.prototype, 'connect').resolves()
  //   sandbox.stub(KafkaConsumer.prototype, 'consume').resolves()
  //   sandbox.stub(KafkaConsumer.prototype, 'commitMessageSync').resolves()
  //   sandbox.stub(Kafka.Consumer, 'getConsumer').returns({
  //     commitMessageSync: async function () { return true }
  //   })
  //   sandbox.stub(Rx.prototype, 'Observable')
  // })
// })
