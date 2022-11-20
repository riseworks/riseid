const { RiseIDFactory } = require('./riseid')
const { ethers } = require('ethers')
const { ArbTable } = require('./utils/arbTable')

const main = async () => {
  // const rpcM = new ethers.providers.JsonRpcProvider('https://goerli.infura.io/v3/f8cf9a5377a042738ccaf1df03f3f005')
  // const providerM = new ethers.Wallet('edbe8d88ad5213345cef8e6d87c4079a5b060394bb80cf3f5afdf2287570c777', rpcM)

  const rpc = new ethers.providers.JsonRpcProvider('https://arbitrum-goerli.infura.io/v3/f8cf9a5377a042738ccaf1df03f3f005')
  const provider = new ethers.Wallet('edbe8d88ad5213345cef8e6d87c4079a5b060394bb80cf3f5afdf2287570c777', rpc)
  const r = await RiseIDFactory.getRiseID('0x845aF9FBeCF986d3E94681F78Dd4c39b4A9Bc1C2', provider)
}

main()
  .then(() => {})
  .catch(e => console.error(e))
