import { narrow } from 'abitype';

export const inflationaryCirclesAbi = narrow([
    { "type": "constructor", "inputs": [], "stateMutability": "nonpayable" },
    {
        "type": "function",
        "name": "DOMAIN_SEPARATOR",
        "inputs": [],
        "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "allowance",
        "inputs": [
            { "name": "_owner", "type": "address", "internalType": "address" },
            { "name": "_spender", "type": "address", "internalType": "address" }
        ],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "approve",
        "inputs": [
            { "name": "_spender", "type": "address", "internalType": "address" },
            { "name": "_amount", "type": "uint256", "internalType": "uint256" }
        ],
        "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "avatar",
        "inputs": [],
        "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "balanceOf",
        "inputs": [{ "name": "_account", "type": "address", "internalType": "address" }],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "circlesIdentifier",
        "inputs": [],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "convertBatchDemurrageToInflationaryValues",
        "inputs": [
            { "name": "_demurrageValues", "type": "uint256[]", "internalType": "uint256[]" },
            { "name": "_dayUpdated", "type": "uint64", "internalType": "uint64" }
        ],
        "outputs": [{ "name": "", "type": "uint256[]", "internalType": "uint256[]" }],
        "stateMutability": "pure"
    },
    {
        "type": "function",
        "name": "convertBatchInflationaryToDemurrageValues",
        "inputs": [
            { "name": "_inflationaryValues", "type": "uint256[]", "internalType": "uint256[]" },
            { "name": "_day", "type": "uint64", "internalType": "uint64" }
        ],
        "outputs": [{ "name": "", "type": "uint256[]", "internalType": "uint256[]" }],
        "stateMutability": "pure"
    },
    {
        "type": "function",
        "name": "convertDemurrageToInflationaryValue",
        "inputs": [
            { "name": "_demurrageValue", "type": "uint256", "internalType": "uint256" },
            { "name": "_dayUpdated", "type": "uint64", "internalType": "uint64" }
        ],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "pure"
    },
    {
        "type": "function",
        "name": "convertInflationaryToDemurrageValue",
        "inputs": [
            { "name": "_inflationaryValue", "type": "uint256", "internalType": "uint256" },
            { "name": "_day", "type": "uint64", "internalType": "uint64" }
        ],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "pure"
    },
    {
        "type": "function",
        "name": "day",
        "inputs": [{ "name": "_timestamp", "type": "uint256", "internalType": "uint256" }],
        "outputs": [{ "name": "", "type": "uint64", "internalType": "uint64" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "decimals",
        "inputs": [],
        "outputs": [{ "name": "", "type": "uint8", "internalType": "uint8" }],
        "stateMutability": "pure"
    },
    {
        "type": "function",
        "name": "decreaseAllowance",
        "inputs": [
            { "name": "_spender", "type": "address", "internalType": "address" },
            { "name": "_subtractedValue", "type": "uint256", "internalType": "uint256" }
        ],
        "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "eip712Domain",
        "inputs": [],
        "outputs": [
            { "name": "fields", "type": "bytes1", "internalType": "bytes1" },
            { "name": "name", "type": "string", "internalType": "string" },
            { "name": "version", "type": "string", "internalType": "string" },
            { "name": "chainId", "type": "uint256", "internalType": "uint256" },
            { "name": "verifyingContract", "type": "address", "internalType": "address" },
            { "name": "salt", "type": "bytes32", "internalType": "bytes32" },
            { "name": "extensions", "type": "uint256[]", "internalType": "uint256[]" }
        ],
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
        "name": "increaseAllowance",
        "inputs": [
            { "name": "_spender", "type": "address", "internalType": "address" },
            { "name": "_addedValue", "type": "uint256", "internalType": "uint256" }
        ],
        "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "inflationDayZero",
        "inputs": [],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "name",
        "inputs": [],
        "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
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
        "name": "nonces",
        "inputs": [{ "name": "_owner", "type": "address", "internalType": "address" }],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "onERC1155BatchReceived",
        "inputs": [
            { "name": "", "type": "address", "internalType": "address" },
            { "name": "", "type": "address", "internalType": "address" },
            { "name": "", "type": "uint256[]", "internalType": "uint256[]" },
            { "name": "", "type": "uint256[]", "internalType": "uint256[]" },
            { "name": "", "type": "bytes", "internalType": "bytes" }
        ],
        "outputs": [{ "name": "", "type": "bytes4", "internalType": "bytes4" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "onERC1155Received",
        "inputs": [
            { "name": "", "type": "address", "internalType": "address" },
            { "name": "_from", "type": "address", "internalType": "address" },
            { "name": "_id", "type": "uint256", "internalType": "uint256" },
            { "name": "_amount", "type": "uint256", "internalType": "uint256" },
            { "name": "", "type": "bytes", "internalType": "bytes" }
        ],
        "outputs": [{ "name": "", "type": "bytes4", "internalType": "bytes4" }],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "permit",
        "inputs": [
            { "name": "_owner", "type": "address", "internalType": "address" },
            { "name": "_spender", "type": "address", "internalType": "address" },
            { "name": "_value", "type": "uint256", "internalType": "uint256" },
            { "name": "_deadline", "type": "uint256", "internalType": "uint256" },
            { "name": "_v", "type": "uint8", "internalType": "uint8" },
            { "name": "_r", "type": "bytes32", "internalType": "bytes32" },
            { "name": "_s", "type": "bytes32", "internalType": "bytes32" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "setup",
        "inputs": [
            { "name": "_hub", "type": "address", "internalType": "address" },
            { "name": "_nameRegistry", "type": "address", "internalType": "address" },
            { "name": "_avatar", "type": "address", "internalType": "address" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "supportsInterface",
        "inputs": [{ "name": "interfaceId", "type": "bytes4", "internalType": "bytes4" }],
        "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "symbol",
        "inputs": [],
        "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "toTokenId",
        "inputs": [{ "name": "_avatar", "type": "address", "internalType": "address" }],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "pure"
    },
    {
        "type": "function",
        "name": "totalSupply",
        "inputs": [],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "transfer",
        "inputs": [
            { "name": "_to", "type": "address", "internalType": "address" },
            { "name": "_amount", "type": "uint256", "internalType": "uint256" }
        ],
        "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "transferFrom",
        "inputs": [
            { "name": "_from", "type": "address", "internalType": "address" },
            { "name": "_to", "type": "address", "internalType": "address" },
            { "name": "_amount", "type": "uint256", "internalType": "uint256" }
        ],
        "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "unwrap",
        "inputs": [{ "name": "_amount", "type": "uint256", "internalType": "uint256" }],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "event",
        "name": "Approval",
        "inputs": [
            { "name": "owner", "type": "address", "indexed": true, "internalType": "address" },
            { "name": "spender", "type": "address", "indexed": true, "internalType": "address" },
            { "name": "value", "type": "uint256", "indexed": false, "internalType": "uint256" }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "DepositInflationary",
        "inputs": [
            { "name": "account", "type": "address", "indexed": true, "internalType": "address" },
            { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" },
            { "name": "demurragedAmount", "type": "uint256", "indexed": false, "internalType": "uint256" }
        ],
        "anonymous": false
    },
    { "type": "event", "name": "EIP712DomainChanged", "inputs": [], "anonymous": false },
    {
        "type": "event",
        "name": "Transfer",
        "inputs": [
            { "name": "from", "type": "address", "indexed": true, "internalType": "address" },
            { "name": "to", "type": "address", "indexed": true, "internalType": "address" },
            { "name": "value", "type": "uint256", "indexed": false, "internalType": "uint256" }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "WithdrawInflationary",
        "inputs": [
            { "name": "account", "type": "address", "indexed": true, "internalType": "address" },
            { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" },
            { "name": "demurragedAmount", "type": "uint256", "indexed": false, "internalType": "uint256" }
        ],
        "anonymous": false
    },
    {
        "type": "error",
        "name": "CirclesAmountOverflow",
        "inputs": [
            { "name": "amount", "type": "uint256", "internalType": "uint256" },
            { "name": "code", "type": "uint8", "internalType": "uint8" }
        ]
    },
    {
        "type": "error",
        "name": "CirclesERC1155CannotReceiveBatch",
        "inputs": [{ "name": "code", "type": "uint8", "internalType": "uint8" }]
    },
    {
        "type": "error",
        "name": "CirclesErrorAddressUintArgs",
        "inputs": [
            { "name": "", "type": "address", "internalType": "address" },
            { "name": "", "type": "uint256", "internalType": "uint256" },
            { "name": "", "type": "uint8", "internalType": "uint8" }
        ]
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
        "name": "CirclesIdMustBeDerivedFromAddress",
        "inputs": [
            { "name": "providedId", "type": "uint256", "internalType": "uint256" },
            { "name": "code", "type": "uint8", "internalType": "uint8" }
        ]
    },
    {
        "type": "error",
        "name": "CirclesInvalidCirclesId",
        "inputs": [
            { "name": "id", "type": "uint256", "internalType": "uint256" },
            { "name": "code", "type": "uint8", "internalType": "uint8" }
        ]
    },
    {
        "type": "error",
        "name": "CirclesInvalidParameter",
        "inputs": [
            { "name": "parameter", "type": "uint256", "internalType": "uint256" },
            { "name": "code", "type": "uint8", "internalType": "uint8" }
        ]
    },
    { "type": "error", "name": "CirclesProxyAlreadyInitialized", "inputs": [] },
    {
        "type": "error",
        "name": "CirclesReentrancyGuard",
        "inputs": [{ "name": "code", "type": "uint8", "internalType": "uint8" }]
    },
    { "type": "error", "name": "ECDSAInvalidSignature", "inputs": [] },
    {
        "type": "error",
        "name": "ECDSAInvalidSignatureLength",
        "inputs": [{ "name": "length", "type": "uint256", "internalType": "uint256" }]
    },
    {
        "type": "error",
        "name": "ECDSAInvalidSignatureS",
        "inputs": [{ "name": "s", "type": "bytes32", "internalType": "bytes32" }]
    },
    {
        "type": "error",
        "name": "ERC20InsufficientAllowance",
        "inputs": [
            { "name": "spender", "type": "address", "internalType": "address" },
            { "name": "allowance", "type": "uint256", "internalType": "uint256" },
            { "name": "needed", "type": "uint256", "internalType": "uint256" }
        ]
    },
    {
        "type": "error",
        "name": "ERC20InsufficientBalance",
        "inputs": [
            { "name": "sender", "type": "address", "internalType": "address" },
            { "name": "balance", "type": "uint256", "internalType": "uint256" },
            { "name": "needed", "type": "uint256", "internalType": "uint256" }
        ]
    },
    {
        "type": "error",
        "name": "ERC20InvalidApprover",
        "inputs": [{ "name": "approver", "type": "address", "internalType": "address" }]
    },
    {
        "type": "error",
        "name": "ERC20InvalidReceiver",
        "inputs": [{ "name": "receiver", "type": "address", "internalType": "address" }]
    },
    {
        "type": "error",
        "name": "ERC20InvalidSender",
        "inputs": [{ "name": "sender", "type": "address", "internalType": "address" }]
    },
    {
        "type": "error",
        "name": "ERC20InvalidSpender",
        "inputs": [{ "name": "spender", "type": "address", "internalType": "address" }]
    },
    {
        "type": "error",
        "name": "ERC2612ExpiredSignature",
        "inputs": [{ "name": "deadline", "type": "uint256", "internalType": "uint256" }]
    },
    {
        "type": "error",
        "name": "ERC2612InvalidSigner",
        "inputs": [
            { "name": "signer", "type": "address", "internalType": "address" },
            { "name": "owner", "type": "address", "internalType": "address" }
        ]
    },
    {
        "type": "error",
        "name": "InvalidAccountNonce",
        "inputs": [
            { "name": "account", "type": "address", "internalType": "address" },
            { "name": "currentNonce", "type": "uint256", "internalType": "uint256" }
        ]
    },
    { "type": "error", "name": "InvalidShortString", "inputs": [] },
    {
        "type": "error",
        "name": "StringTooLong",
        "inputs": [{ "name": "str", "type": "string", "internalType": "string" }]
    }
]);