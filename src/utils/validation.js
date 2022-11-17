const isAddress = str => {
  return /^0x[a-fA-F0-9]{40}$/.test(str.toString())
}

module.exports = {
  isAddress
}