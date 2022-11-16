const { ethers } = require('ethers')
const { certifiedAttributes, roles } = require('./constants')
const BigNumber = require('bignumber.js')

const keccak256 = v => ethers.utils.id(`${v}`)

const { RiseIDABI } = require('./abis')

const RiseAccessABI = [
  "function hasRole(bytes32 role, address account) external view returns (bool)"
]

const RiseCertifiedAttribTypes = {
  RISE_FLAT_COUNT: 'decimal',
  SUBSCRIPTION_PERCENT: 'decimal2',
  SUBSCRIPTION_PERCENT_DISCOUNT: 'decimal2',
  SUBSCRIPTION_FLAT_RATE_DISCOUNT: 'decimal2',
  DIRECT_DEPOSIT_RAMP_TOKEN_ADDR_PERCENT_ONE: 'decimal2',
  DIRECT_DEPOSIT_RAMP_TOKEN_ADDR_PERCENT_TWO: 'decimal2',
  SUBSCRIPTION_FLAT_RATE: 'decimal4',
  SUBSCRIPTION_FLAT_RATE_CREDIT_CARD: 'decimal4',
  RISE_CREDIT: 'decimal6',
  RISE_REFUND: 'decimal6',
  RISE_DEDUCTION: 'decimal6',
  SUBSCRIPTION_TYPE: 'string'
}

const parseAttributes = (data, parseMap) => {
  const _data = {}
  Object.keys(data).forEach(v => {
    const type = parseMap[v]
    let value
    if (type && data[v]) {
      if (type === 'string') {
        value = String.fromCharCode(...ethers.utils.arrayify((data[v])))
      } else if(type.startsWith('decimal')) {
        const n = parseInt(type.replace('decimal', ''))
        const dataNumber = BigNumber(data[v])
        if (n !== '' && !isNaN(n))
          value = dataNumber.div(BigNumber(10).pow(n)).toNumber()
        else
          value = dataNumber.toNumber()
      }
    }
    if (value) {
      _data[v] = value
    } else {
      _data[v] = data[v]
    }
  })
  return _data
}

class RiseID {
  contract = null
  wallets = []

  constructor (contract) {
    this.contract = contract
  }

  connect(signerOrProvider) {
    return new RiseID(this.contract.connect(signerOrProvider))
  }

  // getters
  get owner () {
    return this.wallets.length ? this.wallets[0] : null
  }

  get delegates () {
    return this.wallets.slice(1)
  }

  delegate (idx) {
    return this.wallets.length > (idx + 1) ? this.wallets[idx+1] : null
  }

  async loadWallets() {
    const [owner, delegates] = await Promise.all([
      this.contract.owner(),
      this.contract.getDelegates()
    ])
    this.wallets = [owner, ...delegates]
    return this.wallets
  }

  async getCertifiedData (attributesArray = null) {
    if (attributesArray == null) {
      attributesArray = Object.keys(certifiedAttributes).filter(k => k.startsWith('0x'))
    }

    if (!Array.isArray(attributesArray)) throw 'Invalid array of attributes, it is not an array'

    const filtered = attributesArray.filter(k => !!k)
    const keys = filtered.map(k => {
      if (k.startsWith('0x')) return k
      return keccak256(k)
    })

    if (keys.length === 0) throw 'Invalid array of attributes'

    const values = await this.contract.getCertifiedData(keys)
    const certData = values.reduce(
      (map, v, idx) => ({
        ...map,
        [certifiedAttributes[keys[idx]] || filtered[idx]]: v === '0x' ? null : v
      }),
    {})

    return parseAttributes(certData, RiseCertifiedAttribTypes)
  }

  async getData (attributesArray = null, parseData = null) {
    if (!Array.isArray(attributesArray)) throw 'Invalid array of attributes, it is not an array'

    const filtered = attributesArray.filter(k => !!k)
    const keys = filtered.map(k => k.startsWith('0x') ? k : keccak256(k))
    if (keys.length === 0) throw 'Invalid array of attributes'

    const values = await this.contract.getData(keys)
    const data = values.reduce(
      (map, v, idx) => ({
        ...map,
        [filtered[idx]]: v === '0x' ? null : v
      }),
    {})

    if (parseData) {
      return parseAttributes(data, parseData)
    }

    return data
  }

  async setData (attributesMap) {
    const keys = Object.keys(attributesMap).map(k => k.startsWith('0x') ? k : keccak256(k))
    const values = Object.values(attributesMap).map(v => {
      if (v === null || v === undefined) return Buffer.from('')
      if (typeof v === 'number') return ethers.utils.hexZeroPad(ethers.utils.hexlify(ethers.BigNumber.from(v)), 32)
      return Buffer.from(v)
    })

    if (!keys.length) throw 'invalid keys'

    const tx = await this.contract.setData(keys, values).then(tx => tx.wait())
    return tx
  }
}

class RiseIDFactory {
  static async getRiseID (address, signerOrProvider) {
    const riseContract = new ethers.Contract(address, RiseIDABI, signerOrProvider)

    try {
      const riseAccessAddress = await riseContract['riseAccess()']()
      const riseAccessContract = new ethers.Contract(riseAccessAddress, RiseAccessABI, signerOrProvider)
      const isRiseId = await riseAccessContract.hasRole(roles.RISE_ID_IS_ID, address)
      if (!isRiseId) throw 'This address is not a RiseID contract'
      return new RiseID(riseContract)
    } catch (e) {
      console.log(e)
      throw 'Failed to read riseAccess contract, are you sure this is a RiseID address?'
    }
  }
}

module.exports = {
  RiseIDFactory,
  RiseIDABI,
  certifiedAttributes, roles
}