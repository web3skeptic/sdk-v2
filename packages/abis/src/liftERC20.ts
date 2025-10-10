export const liftERC20Abi = [
  {
    "type": "constructor",
    "inputs": [
      { "name": "_hub", "type": "address" },
      { "name": "_nameRegistry", "type": "address" },
      { "name": "_masterCopyERC20Demurrage", "type": "address" },
      { "name": "_masterCopyERC20Inflation", "type": "address" }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "ERC20_WRAPPER_SETUP_CALLPREFIX",
    "inputs": [],
    "outputs": [{ "name": "", "type": "bytes4" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "hub",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "nameRegistry",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "masterCopyERC20Wrapper",
    "inputs": [{ "name": "", "type": "uint256" }],
    "outputs": [{ "name": "", "type": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "erc20Circles",
    "inputs": [
      { "name": "", "type": "uint8" },
      { "name": "", "type": "address" }
    ],
    "outputs": [{ "name": "", "type": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "ensureERC20",
    "inputs": [
      { "name": "_avatar", "type": "address" },
      { "name": "_circlesType", "type": "uint8" }
    ],
    "outputs": [{ "name": "", "type": "address" }],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "ERC20WrapperDeployed",
    "inputs": [
      { "name": "avatar", "type": "address", "indexed": true },
      { "name": "erc20Wrapper", "type": "address", "indexed": true },
      { "name": "circlesType", "type": "uint8", "indexed": false }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "CirclesErrorNoArgs",
    "inputs": [{ "name": "", "type": "uint8" }]
  },
  {
    "type": "error",
    "name": "CirclesErrorOneAddressArg",
    "inputs": [
      { "name": "", "type": "address" },
      { "name": "", "type": "uint8" }
    ]
  },
  {
    "type": "error",
    "name": "CirclesInvalidParameter",
    "inputs": [
      { "name": "parameter", "type": "uint256" },
      { "name": "code", "type": "uint8" }
    ]
  }
] as const;