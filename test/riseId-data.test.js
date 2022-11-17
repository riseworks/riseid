const { RiseIDFactory, certifiedAttributes } = require('../src/riseid')
const { ethers } = require('ethers')
const { ArbTable } = require('../src/utils/arbTable')
const dotenv = require('dotenv')

const envs = dotenv.parse(require('fs').readFileSync('./test/.env.test').toString())
const {
  RISE_ID_ADDRESS,
  OWNER_WALLET_PRIV_KEY,
  RPC_ENDPOINT,
  RIDE_ID_DELEGATE_PRIV_KEY
} = envs

describe('Read certified attributes and set/read user attributes from a RiseID', 
() => {
  let riseId
  let rpc
  let provider, delegateProvider

  let ownerAddress
  let riseIdDelegateAddress

  beforeAll(async () => {
    rpc = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT)
    provider = new ethers.Wallet(OWNER_WALLET_PRIV_KEY, rpc)
    delegateProvider = new ethers.Wallet(RIDE_ID_DELEGATE_PRIV_KEY, rpc)
    riseId = await RiseIDFactory.getRiseID(RISE_ID_ADDRESS, rpc)

    riseIdDelegateAddress = delegateProvider.address
    ownerAddress = provider.address
  }, 2000000)

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

  test('Add RiseID delegate address', async () => {
    const add = async () => {
      await riseId.connect(provider).addDelegateAddress(riseIdDelegateAddress)
      await riseId.loadWallets()
      expect(riseId.delegates.includes(riseIdDelegateAddress)).toBe(true)
    }

    const remove = async () => {
      await riseId.connect(provider).removeDelegateAddress(riseIdDelegateAddress)
      await riseId.loadWallets()
      expect(!riseId.delegates.includes(riseIdDelegateAddress)).toBe(true)
    }

    const wallets = await riseId.loadWallets()
    if (wallets.includes(riseIdDelegateAddress)) {
      await remove()
      await add()
    } else {
      await add()
      await remove()
    }
  }, 2000000)

  test('Add RiseID delegate by idx', async () => {
    const idx = await ArbTable.connect(provider).lookup(riseIdDelegateAddress)
    
    const add = async () => {
      await riseId.connect(provider).addDelegateIdx(idx)
      await riseId.loadWallets()
      expect(riseId.delegates.includes(riseIdDelegateAddress)).toBe(true)
    }

    const remove = async () => {
      await riseId.connect(provider).removeDelegateIdx(idx)
      await riseId.loadWallets()
      expect(!riseId.delegates.includes(riseIdDelegateAddress)).toBe(true)
    }

    const wallets = await riseId.loadWallets()
    if (wallets.includes(riseIdDelegateAddress)) {
      await remove()
      await add()
    } else {
      await add()
      await remove()
    }
  }, 200000)

  test('Transfer Ownership', async () => {
    await riseId.loadWallets()

    // transfer to delegate
    await riseId.connect(provider).transferOwnership(riseIdDelegateAddress)
    await riseId.loadWallets()
    expect(riseId.owner).toBe(riseIdDelegateAddress)

    // transfer back to old owner
    await riseId.connect(delegateProvider).transferOwnership(ownerAddress)
    await riseId.loadWallets()
    expect(riseId.owner).toBe(ownerAddress)
  }, 200000)
})