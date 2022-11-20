const { ethers } = require('ethers')
const { ArbAddressTableABI } = require('../abis')
const { isAddress } = require('./validation')

const ARB_ADDRESS_TABLE = '0x0000000000000000000000000000000000000066'
const ArbTable = new ethers.Contract(ARB_ADDRESS_TABLE, ArbAddressTableABI)

const resolveAddressOrIdx = async (table, addressOrIdx) => {
  let p
  if (isAddress(addressOrIdx)) p = table.lookup(addressOrIdx)
  else p = Promise.resolve(addressOrIdx)

  try {
    return await p
  } catch (e) {
    throw `Address ${addressOrIdx} is not registered in Arbitrum Address Table`
  }
}

module.exports = {
  ArbTable,
  resolveAddressOrIdx
}