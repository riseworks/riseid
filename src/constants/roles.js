'use strict';
// SPDX-License-Identifier: UNLICENSED
// Copyright 2022 Rise Works Inc.

const { utils } = require('ethers');
const keccak256 = utils.id;

module.exports = {

  // Rise Higher level admin to control contracts
  RISE_ADMIN : keccak256('RISE_ADMIN'),


  /**
  * @notice RISE ID
  */

  /**
  * @dev Allowed to manage RiseIDs. This is important to have overall control of the IDs
  */
  RISE_ID_IS_ADMIN : keccak256('RISE_ID_IS_ADMIN'),
  /**
  * @dev Is a Rise ID
  */
  RISE_ID_IS_ID : keccak256('RISE_ID_IS_ID'),
  /**
  * @dev Is a Rise ID Type
  */
  RISE_ID_IS_DAO : keccak256('RISE_ID_IS_DAO'),
  RISE_ID_IS_BUSINESS : keccak256('RISE_ID_IS_BUSINESS'),
  RISE_ID_IS_INDIVIDUAL : keccak256('RISE_ID_IS_INDIVIDUAL'),
  /**
  * @dev Allowed to create new instances of RiseIDs
  */
  RISE_ID_CAN_CLONE : keccak256('RISE_ID_CAN_CLONE'),
  /**
  * @dev Is a Cloneable Rise ID
  */
  RISE_ID_IS_CLONEABLE : keccak256('RISE_ID_IS_CLONEABLE'),
  /**
  * @dev Address can set Rise Certified attributes on IDs
  */
  RISE_ID_CAN_CERTIFIED_ATTRIBUTE : keccak256('RISE_ID_CAN_CERTIFIED_ATTRIBUTE'),
  /**
    * @dev Address can set RisePay and Forwarder on IDs
    */
  RISE_ID_CAN_UPDATE_RISE_CONTRACTS : keccak256('RISE_ID_CAN_UPDATE_RISE_CONTRACTS'),


  /**
  * @notice RISE PAYER/PAYEE
  */

  /**
  * @dev Is a Rise Pay Admin that can call
  */
  RISE_PAY_CAN_RISE_FIAT_FUNDER : keccak256('RISE_PAY_CAN_RISE_FIAT_FUNDER'),
  /**
    * @dev Can set Payer and Payee
    */
  RISE_PAY_CAN_SET_PAY_ROLE : keccak256('RISE_PAY_CAN_SET_PAY_ROLE'),
  /**
  * @dev Address is a Payer and can send Tokens to Payee
  */
  RISE_PAY_IS_PAYER : keccak256('RISE_PAY_IS_PAYER'),
  /**
  * @dev Address is a Payee and can receieve payments with RisePayToken
  */
  RISE_PAY_IS_PAYEE : keccak256('RISE_PAY_IS_PAYEE'),


  /**
  * @notice RISE RAMP
  */

  /**
  * @dev Is a Rise Pay Ramp
  */
  RISE_RAMP_IS_RAMP : keccak256('RISE_RAMP_IS_RAMP'),
  /**
  * @dev Rise Pay Ramp - User cannot fund - only system
  */
  RISE_RAMP_IS_NO_USER_FUNDING : keccak256("RISE_RAMP_IS_NO_USER_FUNDING"),
  /**
  * @dev Can enable users on a ramp
  */
  RISE_RAMP_CAN_USER_ENABLE : keccak256('RISE_RAMP_CAN_USER_ENABLE'),

  /**
  * @dev Can call Fund functions on Ramps (Should be only RisePay)
  */
  RISE_PAY_RAMP_CAN_FUND : keccak256('RISE_PAY_RAMP_CAN_FUND'),
  /**
  * @dev Can call Withdraw functions on Ramps (Should be only RisePay)
  */
  RISE_PAY_RAMP_CAN_WITHDRAW : keccak256('RISE_PAY_RAMP_CAN_WITHDRAW'),


  /**
  * @notice RISE TOKEN
  */

  /**
  * @dev Can execute transfers, allowance, typical token functions
  */
  RISE_PAY_TOKEN_CAN_EXECUTE : keccak256('RISE_PAY_TOKEN_CAN_EXECUTE'),
  /**
  * @dev Can Mint Tokens (Should be only RisePay)
  */
  RISE_PAY_TOKEN_CAN_MINT : keccak256('RISE_PAY_TOKEN_CAN_MINT'),
  /**
  * @dev Can Burn Tokens (Should be only RisePay)
  */
  RISE_PAY_TOKEN_CAN_BURN : keccak256('RISE_PAY_TOKEN_CAN_BURN'),
  /**
  * @dev Can Execute Pay functions (transfer from Payer to Payee) (Should be only RisePay)
  */
  RISE_PAY_TOKEN_CAN_PAY : keccak256('RISE_PAY_TOKEN_CAN_PAY'),

  /**
  * @dev Is a Rise Trusted Forwarder
  */
  RISE_IS_FORWARDER : keccak256('RISE_IS_FORWARDER'),


  /**
  * @dev Can change pay schedule data
  */
  RISE_STORAGE_CAN_MODIFY : keccak256('RISE_STORAGE_CAN_MODIFY'),



  '0x2a6f40be47f2ad257eaf156f44070c9875ffce338d38b90163dfaf73cf5b928f' : 'RiseIDDAO',
  '0x6d80a7dcc5b9ee1df097f687f4d6d4725cfaa66132d4928e34b93b99fbd591d5' : 'RiseIDBusiness',
  '0x391df09d9e695a7a3c21d2ccc543eb23613876ed9ab3563ded9306cf1a3df0fc' : 'RiseIDIndividual',
  '0xb2e24852ed03afea952fd15cab3a0e5c73eefd917c7a2ad8611e30907e3c8cbd' : 'RisePayRampUSDC',
  '0x5a43244f46520655159ed224a5c0e2da61cd33d7d41ffbc5ca956c07a4134646' : 'RisePayRampUSDACH',
  '0x22debfac53c00810e120b417545d593ff58cf2fad703afba4c53faa3d5381842' : 'RisePayRampUSDWire',
  '0x749b625d30b443367e99358571c493510045ee9174b47adadd233840c2f34984' : 'RisePayRampUSDCircleACH',
  '0x076e142207389861d646f8daafaad63ead1a7fe300762211ad50af1b744f02c5' : 'RisePayRampUSDCircleWire',
  '0xb175427467e32a54fda9780b3a49de2c2a40da35578f253ec9f52586995c935f' : 'RisePayRampUniswap',
  '0x910e92c2fc786771ed6867285e535545a7d8d46a5736f59f9732655e7742e3e3' : 'RisePayRampIndependentFunding',
  '0xd107b3a92c81940a319225049d527a2686c41df524ded928dfb79b1160a57025' : 'RisePayRampUSDCEthereumL1',
  RisePayRampUSDC : '0xb2e24852ed03afea952fd15cab3a0e5c73eefd917c7a2ad8611e30907e3c8cbd',
  RisePayRampUSDACH : '0x5a43244f46520655159ed224a5c0e2da61cd33d7d41ffbc5ca956c07a4134646',
  RisePayRampUSDWire : '0x22debfac53c00810e120b417545d593ff58cf2fad703afba4c53faa3d5381842',
  RisePayRampUSDCircleACH : '0x749b625d30b443367e99358571c493510045ee9174b47adadd233840c2f34984',
  RisePayRampUSDCircleWire : '0x076e142207389861d646f8daafaad63ead1a7fe300762211ad50af1b744f02c5',
  RisePayRampUniswap : '0xb175427467e32a54fda9780b3a49de2c2a40da35578f253ec9f52586995c935f',
  RisePayRampIndependentFunding : '0x910e92c2fc786771ed6867285e535545a7d8d46a5736f59f9732655e7742e3e3',
  RisePayRampUSDCEthereumL1 : '0xd107b3a92c81940a319225049d527a2686c41df524ded928dfb79b1160a57025',
};
