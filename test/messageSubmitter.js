const Utility = require('./src/lib/utility')

const message = {

}

const messageSubimtter = async (message) => {
  try {
    const success = {
      status: 'success',
      code: 0,
      description: 'action successful'
    }
    await Utility.produceGeneralMessage('notification', 'settlement-transfer-position-change', message, success)
    console.log('Message on kafka queue')
  } catch (err) {
    console.log('Message wasnt placed on Kaka queue : ' + err)
  }
}

messageSubimtter(message)
