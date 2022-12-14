const { utils } = require('ethers');
const keccak256 = utils.id;

module.exports = {
  RISE_CREDIT: keccak256('RISE_CREDIT'),
  RISE_REFUND: keccak256('RISE_REFUND'),
  SUBSCRIPTION_TYPE: keccak256('SUBSCRIPTION_TYPE'),
  SUBSCRIPTION_PERCENT: keccak256('SUBSCRIPTION_PERCENT'),
  SUBSCRIPTION_PERCENT_DISCOUNT: keccak256('SUBSCRIPTION_PERCENT_DISCOUNT'),
  SUBSCRIPTION_FLAT_COUNT: keccak256('SUBSCRIPTION_FLAT_COUNT'),
  SUBSCRIPTION_FLAT_RATE: keccak256('SUBSCRIPTION_FLAT_RATE'),
  SUBSCRIPTION_FLAT_RATE_DISCOUNT: keccak256('SUBSCRIPTION_FLAT_RATE_DISCOUNT'),
  SUBSCRIPTION_FLAT_RATE_CREDIT_CARD: keccak256('SUBSCRIPTION_FLAT_RATE_CREDIT_CARD'),
  DIRECT_DEPOSIT_RAMP_TOKEN_ADDR_PERCENT_ONE: keccak256('DIRECT_DEPOSIT_RAMP_TOKEN_ADDR_PERCENT_ONE'),
  DIRECT_DEPOSIT_RAMP_TOKEN_ADDR_PERCENT_TWO: keccak256('DIRECT_DEPOSIT_RAMP_TOKEN_ADDR_PERCENT_TWO'),
  RISE_DEDUCTION: keccak256('RISE_DEDUCTION'),

  [keccak256('RISE_CREDIT')]: 'RISE_CREDIT',
  [keccak256('RISE_REFUND')]: 'RISE_REFUND',
  [keccak256('SUBSCRIPTION_TYPE')]: 'SUBSCRIPTION_TYPE',
  [keccak256('SUBSCRIPTION_PERCENT')]: 'SUBSCRIPTION_PERCENT',
  [keccak256('SUBSCRIPTION_PERCENT_DISCOUNT')]: 'SUBSCRIPTION_PERCENT_DISCOUNT',
  [keccak256('SUBSCRIPTION_FLAT_COUNT')]: 'SUBSCRIPTION_FLAT_COUNT',
  [keccak256('SUBSCRIPTION_FLAT_RATE')]: 'SUBSCRIPTION_FLAT_RATE',
  [keccak256('SUBSCRIPTION_FLAT_RATE_DISCOUNT')]: 'SUBSCRIPTION_FLAT_RATE_DISCOUNT',
  [keccak256('SUBSCRIPTION_FLAT_RATE_CREDIT_CARD')]: 'SUBSCRIPTION_FLAT_RATE_CREDIT_CARD',
  [keccak256('DIRECT_DEPOSIT_RAMP_TOKEN_ADDR_PERCENT_ONE')]: 'DIRECT_DEPOSIT_RAMP_TOKEN_ADDR_PERCENT_ONE',
  [keccak256('DIRECT_DEPOSIT_RAMP_TOKEN_ADDR_PERCENT_TWO')]: 'DIRECT_DEPOSIT_RAMP_TOKEN_ADDR_PERCENT_TWO',
  [keccak256('RISE_DEDUCTION')]: 'RISE_DEDUCTION',
}