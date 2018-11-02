/* global describe it */
import {run} from '@syncano/test'

describe('generate', function () {
  it('simple test', async () => {


  require('@syncano/core').__setMocks({
    data: {
      profiles: {
        list: jest.fn().mockImplementationOnce((eventName, params) => {
          return Promise.resolve([])
        })
      }
    })

    const args = {
      model: 'name', // example
    }

    const result = await run('endpoint', {args})
    expect(result).toHaveProperty('code', 200)
    // expect(result.data).toHaveProperty('objects')
  })
})
