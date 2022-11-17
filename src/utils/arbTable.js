const { ethers } = require('ethers')
const { ArbAddressTableABI } = require('../abis')
const { isAddress } = require('./validation')

const ARB_ADDRESS_TABLE = '0x0000000000000000000000000000000000000066'
const ArbTable = new ethers.Contract(ARB_ADDRESS_TABLE, ArbAddressTableABI)

const resolveAddressOrIdx = (table, addressOrIdx) => {
  let p
  if (isAddress(addressOrIdx)) p = table.lookup(addressOrIdx)
  else p = Promise.resolve(addressOrIdx)

  return p
}

module.exports = {
  ArbTable,
  resolveAddressOrIdx
}