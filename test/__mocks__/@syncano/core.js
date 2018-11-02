import merge from 'lodash.merge'
import sinon from 'sinon'
const Syncano = require.requireActual('@syncano/core')

let syncanoStubbed = null
let customMock = null

if (syncanoStubbed) {
  syncanoStubbed.restore()
} else {
  syncanoStubbed = sinon.stub(Syncano, 'constructor')
    .callsFake(ctx => {
      let syncano = new Syncano(ctx)
      if (customMock) {
        syncano = merge(syncano, customMock)

        if (customMock.data) {
          syncano.data = customMock.data
        }
      }
      return syncano
    })
}

syncanoStubbed.__setMocks = (mocks) => {
  customMock = mocks
}

module.exports = syncanoStubbed
