const { RiseIDFactory, certifiedAttributes } = require('../src/riseid')
const { ethers } = require('ethers')

const { RISE_ID_ADDRESS, WALLET_KEY, RPC_ENDPOINT } = process.env

describe('Read certified attributes and set/read user attributes from a RiseID', 
() => {
  let riseId

  beforeAll(async () => {
    const rpc = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT)
    provider = new ethers.Wallet(WALLET_KEY, rpc)
    riseId = await RiseIDFactory.getRiseID(RISE_ID_ADDRESS, rpc)
  })

  test('Read all certified RiseID attributes', async () => {
    // read all attributes
    const expectedKeys = Object.keys(certifiedAttributes).filter(k => !k.startsWith('0x'))
    const allAttributes = await riseId.getCertifiedData()
    expect(Object.keys(allAttributes)).toEqual(expectedKeys)

    // read all attributes using non hex keys
    const allAttributes2 = await riseId.getCertifiedData(expectedKeys)
    expect(Object.keys(allAttributes2)).toEqual(expectedKeys)

    // read all attributes using hex keys
    const hexKeys = Object.keys(certifiedAttributes).filter(k => k.startsWith('0x'))
    const allAttributes3 = await riseId.getCertifiedData(hexKeys)
    expect(Object.keys(allAttributes3)).toEqual(expectedKeys)

    // read a subset of attributes specifying hex keys and not hex keys
    const attribs = await riseId.getCertifiedData([certifiedAttributes.SUBSCRIPTION_TYPE, 'SUBSCRIPTION_PERCENT'])
    expect(Object.keys(attribs)).toEqual(['SUBSCRIPTION_TYPE', 'SUBSCRIPTION_PERCENT']) 
  }, 2000000)

  test('Put user data in the RiseID attribute', async () => {
    const userData = { EMAIL: 'hidden@gmail.com', NICKNAME: 'HIDDEN', TYPE: 'HUMAN', ID: 5000 }
    const clearData = { EMAIL: null, NICKNAME: null, TYPE: null, ID: null }
    const userDataTypes = { EMAIL: 'string', NICKNAME: 'string', TYPE: 'string', ID: 'decimal' }

    await riseId.connect(provider).setData(userData)
    const data = await riseId.getData(Object.keys(userData), userDataTypes)
    expect(data).toEqual(userData)

    // read using hex version of keys
    const hexEmailKey = ethers.utils.id('EMAIL')
    const readData = await riseId.getData([ hexEmailKey, 'TYPE'], { [hexEmailKey]: 'string', TYPE: 'string' })
    expect(readData).toEqual({ [hexEmailKey]: 'hidden@gmail.com', TYPE: 'HUMAN' })

    // clear data and read
    await riseId.connect(provider).setData(clearData)
    const clearedData = await riseId.getData(Object.keys(clearData), userDataTypes)
    expect(clearedData).toEqual(clearData)

  }, 2000000)


})