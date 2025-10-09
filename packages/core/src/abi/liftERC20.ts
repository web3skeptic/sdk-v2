export const liftERC20Abi = [
  {
    "type": "constructor",
    "inputs": [
      { "name": "_hub", "type": "address", "internalType": "contract IHubV2" },
      { "name": "_nameRegistry", "type": "address", "internalType": "contract INameRegistry" },
      { "name": "_masterCopyERC20Demurrage", "type": "address", "internalType": "address" },
      { "name": "_masterCopyERC20Inflation", "type": "address", "internalType": "address" }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "ERC20_WRAPPER_SETUP_CALLPREFIX",
    "inputs": [],
    "outputs": [{ "name": "", "type": "bytes4", "internalType": "bytes4" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "hub",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address", "internalType": "contract IHubV2" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "nameRegistry",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address", "internalType": "contract INameRegistry" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "masterCopyERC20Wrapper",
    "inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "erc20Circles",
    "inputs": [
      { "name": "", "type": "uint8", "internalType": "enum CirclesType" },
      { "name": "", "type": "address", "internalType": "address" }
    ],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "ensureERC20",
    "inputs": [
      { "name": "_avatar", "type": "address", "internalType": "address" },
      { "name": "_circlesType", "type": "uint8", "internalType": "enum CirclesType" }
    ],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "ERC20WrapperDeployed",
    "inputs": [
      { "name": "avatar", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "erc20Wrapper", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "circlesType", "type": "uint8", "indexed": false, "internalType": "enum CirclesType" }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "CirclesErrorNoArgs",
    "inputs": [{ "name": "", "type": "uint8", "internalType": "uint8" }]
  },
  {
    "type": "error",
    "name": "CirclesErrorOneAddressArg",
    "inputs": [
      { "name": "", "type": "address", "internalType": "address" },
      { "name": "", "type": "uint8", "internalType": "uint8" }
    ]
  },
  {
    "type": "error",
    "name": "CirclesInvalidParameter",
    "inputs": [
      { "name": "parameter", "type": "uint256", "internalType": "uint256" },
      { "name": "code", "type": "uint8", "internalType": "uint8" }
    ]
  }
] as const;
