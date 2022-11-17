const { ethers } = require('ethers')
const { ArbAddressTableABI } = require('../abis')

const ARB_ADDRESS_TABLE = '0x0000000000000000000000000000000000000066'
const ArbTable = new ethers.Contract(ARB_ADDRESS_TABLE, ArbAddressTableABI)

module.exports = {
  ArbTable
}