/*****
 * @file This registers all handlers for the central-ledger API
 License
 --------------
 Copyright © 2020-2025 Mojaloop Foundation
 The Mojaloop files are made available by the Mojaloop Foundation under the Apache License, Version 2.0 (the "License") and you may not use these files except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, the Mojaloop files are distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

 Contributors
 --------------
 This is the official list of the Mojaloop project contributors for this file.
 Names of the original copyright holders (individuals or organizations)
 should be listed with a '*' in the first column. People who have
 contributed from an organization can be listed under the organization
 that actually holds the copyright for their contributions (see the
 Mojaloop Foundation for an example). Those individuals should have
 their names indented and be marked with a '-'. Email address can be added
 optionally within square brackets <email>.

 * Mojaloop Foundation
 - Name Surname <name.surname@mojaloop.io>

 * Georgi Georgiev <lazola.lucas@modusbox.com>

 --------------
 ******/

'use strict'

/**
 * @module src/lib/enum.js
 */

// Code specific (non-DB) enumerations sorted alphabetically
const transferEventType = {
  PREPARE: 'prepare',
  POSITION: 'position',
  TRANSFER: 'transfer',
  FULFIL: 'fulfil',
  NOTIFICATION: 'notification',
  ADMIN: 'admin',
  GET: 'get'
}

const notificationActionMap = {
  NET_DEBIT_CAP_BREACH_MAIL: 'sendEmail'
}

const limitNotificationMap = {
  NET_DEBIT_CAP: 'NET_DEBIT_CAP_BREACH_MAIL'
}

const transferEventAction = {
  PREPARE: 'prepare',
  PREPARE_DUPLICATE: 'prepare-duplicate',
  TRANSFER: 'transfer',
  COMMIT: 'commit',
  ABORT: 'abort',
  TIMEOUT_RECEIVED: 'timeout-received',
  TIMEOUT_RESERVED: 'timeout-reserved',
  REJECT: 'reject',
  FAIL: 'fail',
  EVENT: 'event',
  FULFIL: 'fulfil'
}
const adminTransferAction = {
  RECORD_FUNDS_IN: 'recordFundsIn',
  RECORD_FUNDS_OUT_PREPARE: 'recordFundsOutPrepare',
  RECORD_FUNDS_OUT_COMMIT: 'recordFundsOutCommit',
  RECORD_FUNDS_OUT_ABORT: 'recordFundsOutAbort'
}
const rejectionType = {
  EXPIRED: 'expired',
  CANCELLED: 'cancelled'
}
const transferEventStatus = {
  SUCCESS: 'success',
  FAILED: 'failed'
}
const headers = {
  FSPIOP: {
    SWITCH: 'central-switch'
  }
}
const topicMap = {
  position: {
    commit: {
      functionality: transferEventType.POSITION,
      action: transferEventAction.FULFIL
    },
    'timeout-reserved': {
      functionality: transferEventType.POSITION,
      action: transferEventAction.ABORT
    },
    reject: {
      functionality: transferEventType.POSITION,
      action: transferEventAction.ABORT
    }
  },
  notification: {
    prepare: {
      functionality: transferEventType.NOTIFICATION,
      action: transferEventAction.EVENT
    },
    'prepare-duplicate': {
      functionality: transferEventType.NOTIFICATION,
      action: transferEventAction.EVENT
    },
    commit: {
      functionality: transferEventType.NOTIFICATION,
      action: transferEventAction.EVENT
    },
    abort: {
      functionality: transferEventType.NOTIFICATION,
      action: transferEventAction.EVENT
    },
    'timeout-received': {
      functionality: transferEventType.NOTIFICATION,
      action: transferEventAction.EVENT
    },
    reject: {
      functionality: transferEventType.NOTIFICATION,
      action: transferEventAction.EVENT
    },
    get: {
      functionality: transferEventType.NOTIFICATION,
      action: transferEventAction.EVENT
    },
    event: {
      functionality: transferEventType.NOTIFICATION,
      action: transferEventAction.EVENT
    }
  }
}

module.exports = {
  transferEventType,
  transferEventAction,
  adminTransferAction,
  rejectionType,
  transferEventStatus,
  headers,
  topicMap,
  notificationActionMap,
  limitNotificationMap
}
