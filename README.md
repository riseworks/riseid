# riseid.js

Use this module to interact direct with your RiseID contract on Arbitrum network from [Rise Pay App](https://pay.riseworks.io/).

## How to use

Instantiate a new RiseID

    const signerOrProvider = await getSignerOrProvider() // ethers provider or signer
    const riseId = await RiseIDFactory.getRiseID('0x1234...', signerOrProvider) // pass your RiseID address and a ethers provider
    const balance = await riseId.getbalance() // return a BigNumber(bignumber.js) with your balance, 6 decimals
    console.log(balance.toFixed())
    
The `RiseIDFactory` will return a RiseID instance that is able to interact with your RiseID contract on chain, execute funding,, withdraw, payments, add/remove delagates, query data, etc.

## RiseID data and certified data

You can read Rise certified data from your RiseID storage like this
 
    const { RiseIDFactory, certifiedAttributes } = require('@rise/riseid.js')
    // ...
    const certifiedData = await riseId.getCertifiedData()
    console.log(certifiedData.SUBSCRIPTION_TYPE) // string

    // Read only a subset of the props
    const { SUBSCRIPTION_FLAT_RATE } = await riseId.getCertifiedData([certifiedAttributes.SUBSCRIPTION_FLAT_RATE])
    console.log(SUBSCRIPTION_FLAT_RATE?.toFixed()) // if set, will return a BigNumber(bignumber.js) instance
    
RiseID certified data can only be read from, but you can set your own properties on your RiseID:
 
    // Map of attributes
    const tx = await riseId.setData({ email: 'myemail@gmail.com', age: 40 })
    console.log('Transaction data', tx) // return a ethers transaction object(with event logs, etc.)

    // read attributes, pass a list of attribute names, and optionally a map of how to parse each field
    const { email, age } = await riseId.getData(['email', 'age'], { email: 'string', age: 'decimal' })
    console.log(email, age.toFixed())
    
The second parameter of `getData` specifiy how each attribute value should be parsed, since the data is stored as hexadecimal strings on your RiseID contract, when reading them you can specify to the module how to parse the attributes, you can only choose between `string`(will return a string) or `decimal`(will return a BigNumber instance), if you don't inform how to parse an attribute, it will be returned as a hexadecimal string.

## RiseID wallets

Interact with your delegates and owner addresses

    const wallets = await riseId.loadWallets() // load owner and delegates
    console.log(wallets) // the address at index 0 is the owner, others, if exists, will be the delegates
    
 After loading the walelts you can use some getters to facilitate usage
 
    riseId.owner // returns the owner address
    riseId.delegates // return an array of delegates
    riseId.delegate(idx) // return the delegate address at the idx specified(starting at 0) or null if invalid idx
    
 You can add/remove delegates
 
    // add
    const tx = await riseId.addDelegate('0x1234...')
    // remove
    const rTx = await riseId.removeDelegate('0x1234...')
   
Transfer your RiseID ownership

    const tx = await riseId.transferOwnership('0x12345') // pass the new owner address
    // after transferring ownership, transaction executions with previous owner wallet will not work, so switch the provider
    riseId = riseId.connect(newOwnerWalletProvider)
    
## Balances

Check how much balance you have to withdraw or pay other RiseIDs

    const balance = await riseId.getBalance() // return a BigNumber(bignumber.js)
    console.log(`Your balance is ${balance.div(1e6).toFixed()}`)
    
    // Check other token balance on your RiseID
    const USDCBalance = await riseId.getUSDCBalance() // return your RiseID balance for Circle USDC
    console.log(`You have ${USDCBalance.div(1e6).toFixed()}`)
    
    // Check any token balance on your RiseID
    const tokenBalance = await riseId.getTokenBalance('0x0001234...')
    console.log(`You have ${tokenBalance.div(tokenDecimals).toFixed()}`)
    
 Note that USDC or any other token balance cannot be used to withdraw money or pay on Rise, you can only use these balances to fund.
 Only the RisePayToken balance can be used to pay or withdraw.
 
 ## Funding
 
 Move some money to your RiseID, you can only fund your RiseID if it have the `RISE_PAY_IS_PAYER` role
 
    // Make sure your RiseID address has some USDC tokens, specify the amount in token decimals
    const tx = await riseId.fundWithUSDCBalance('10000000') // fund RiseID with 10 USDC
    console.log(tx)
    
    // Fund with any uniswap accepted token
    const wtx = await riseId.fundWithTokenBalance(WETH_ADDRESS, '1000000000000000')
    console.log(wtx)
    
    // Fund with any wallet, you will need to give your RiseID enough allowance on that wallet, so it will be able to move the funds from the Wallet
    const atx = await riseId.fundWithTokenAllowance(WETH_ADDRESS, '1000000000000000', '0x0001234')
    console.log(atx)
    
    // Fund with your Layer 1 balance
    const l1Tx = await riseId.connectL1(l1Provider).fundWithUSDCL1('10000000')
    console.log(l1Tx)
    
To fund with L1 you will need to have a wallet with some token balance(USDC, WETH, etc.), create an ethers providers with it and call `connectL1` to be able to move funds from that wallet to your RiseID, also, you need to give the Rise L1 Ramp allowance on your wallet, the contract address that should receive the allowance can be found by accessing `riseId.riseContracts.RisePayRampIndependentFunding.address`. L1 funding should take much more time to process than l2 transactions, because it is essentially a bridge from l1 to l2

## Withdraw

Move money out of your RiseID to your wallet, you can withdraw USDC or any other uniswap accepted token

    // Withdraw USDC
    const tx = await riseId.withdrawUSDC('100000000', MyAccountAddress)
    console.log(tx)
    
    // Withdraw any token, specify the amount in token units
    const tx = await riseId.withdrawToken(WETH_ADDRESS, '1000000000000000000', MyAccountAddress)
    
    // Withdraw USDC to a Layer 1 wallet
    const tx = await riseId.withdrawUSDCL1('100000000', MyLayer1AccountAddress)
    
## Pay another RiseID

You can pay another RiseID by calling the pay functions, but you can only pay someone if you have the right role `RISE_PAY_IS_PAYER`
    
    // Pay methods require that you inform the RiseID arbitrum table index instead of the address
    const payeeIdx = await riseId.arbTable.lookup(PayeeAddress)
    // Pay $1000 dolars to a payee, the salt should be unique per payee and amount, pay hash = (payee, amount, salt)
    // duplicated payments will throw
    const tx = await riseId.pay(payeeIdx, '1000000000', uniqueSalt)
    
    // You can also make batch payments
    const batchTx = await riseId.batchPay([{ riseIdPayeeIdx, amount, uniqueSalt }, {...}])
    
To be able to pay another RiseID, you should also add him as your Payee
    
    // pass the RiseID payee address or idx on arbitrum table
    await riseId.addPayee('0x12345...')
    // you can also remove the payee relationship
    await riseId.removePayee('0x12345...')
    
    // Test if relationship exists
    await riseId.isPayerAndPayee('0x12345...')
