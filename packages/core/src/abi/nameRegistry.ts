export const nameRegistryAbi = [
    {
        "type": "constructor",
        "inputs": [{ "name": "_hub", "type": "address", "internalType": "contract IHubV2" }],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "DEFAULT_CIRCLES_NAME_PREFIX",
        "inputs": [],
        "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "DEFAULT_CIRCLES_SYMBOL",
        "inputs": [],
        "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "MAX_SHORT_NAME",
        "inputs": [],
        "outputs": [{ "name": "", "type": "uint72", "internalType": "uint72" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "avatarToMetaDataDigest",
        "inputs": [{ "name": "", "type": "address", "internalType": "address" }],
        "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "calculateShortNameWithNonce",
        "inputs": [
            { "name": "_avatar", "type": "address", "internalType": "address" },
            { "name": "_nonce", "type": "uint256", "internalType": "uint256" }
        ],
        "outputs": [{ "name": "shortName_", "type": "uint72", "internalType": "uint72" }],
        "stateMutability": "pure"
    },
    {
        "type": "function",
        "name": "customNames",
        "inputs": [{ "name": "", "type": "address", "internalType": "address" }],
        "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "customSymbols",
        "inputs": [{ "name": "", "type": "address", "internalType": "address" }],
        "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getMetadataDigest",
        "inputs": [{ "name": "_avatar", "type": "address", "internalType": "address" }],
        "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
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
        "name": "isValidName",
        "inputs": [{ "name": "_name", "type": "string", "internalType": "string" }],
        "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
        "stateMutability": "pure"
    },
    {
        "type": "function",
        "name": "isValidSymbol",
        "inputs": [{ "name": "_symbol", "type": "string", "internalType": "string" }],
        "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
        "stateMutability": "pure"
    },
    {
        "type": "function",
        "name": "name",
        "inputs": [{ "name": "_avatar", "type": "address", "internalType": "address" }],
        "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "registerCustomName",
        "inputs": [
            { "name": "_avatar", "type": "address", "internalType": "address" },
            { "name": "_name", "type": "string", "internalType": "string" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "registerCustomSymbol",
        "inputs": [
            { "name": "_avatar", "type": "address", "internalType": "address" },
            { "name": "_symbol", "type": "string", "internalType": "string" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    { "type": "function", "name": "registerShortName", "inputs": [], "outputs": [], "stateMutability": "nonpayable" },
    {
        "type": "function",
        "name": "registerShortNameWithNonce",
        "inputs": [{ "name": "_nonce", "type": "uint256", "internalType": "uint256" }],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "searchShortName",
        "inputs": [{ "name": "_avatar", "type": "address", "internalType": "address" }],
        "outputs": [
            { "name": "shortName_", "type": "uint72", "internalType": "uint72" },
            { "name": "nonce_", "type": "uint256", "internalType": "uint256" }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "setMetadataDigest",
        "inputs": [
            { "name": "_avatar", "type": "address", "internalType": "address" },
            { "name": "_metadataDigest", "type": "bytes32", "internalType": "bytes32" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "shortNameToAvatar",
        "inputs": [{ "name": "", "type": "uint72", "internalType": "uint72" }],
        "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "shortNames",
        "inputs": [{ "name": "", "type": "address", "internalType": "address" }],
        "outputs": [{ "name": "", "type": "uint72", "internalType": "uint72" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "symbol",
        "inputs": [{ "name": "_avatar", "type": "address", "internalType": "address" }],
        "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "updateMetadataDigest",
        "inputs": [{ "name": "_metadataDigest", "type": "bytes32", "internalType": "bytes32" }],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "event",
        "name": "RegisterShortName",
        "inputs": [
            { "name": "avatar", "type": "address", "indexed": true, "internalType": "address" },
            { "name": "shortName", "type": "uint72", "indexed": false, "internalType": "uint72" },
            { "name": "nonce", "type": "uint256", "indexed": false, "internalType": "uint256" }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "UpdateMetadataDigest",
        "inputs": [
            { "name": "avatar", "type": "address", "indexed": true, "internalType": "address" },
            { "name": "metadataDigest", "type": "bytes32", "indexed": false, "internalType": "bytes32" }
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
    {
        "type": "error",
        "name": "CirclesNamesAvatarAlreadyHasCustomNameOrSymbol",
        "inputs": [
            { "name": "avatar", "type": "address", "internalType": "address" },
            { "name": "nameOrSymbol", "type": "string", "internalType": "string" },
            { "name": "code", "type": "uint8", "internalType": "uint8" }
        ]
    },
    {
        "type": "error",
        "name": "CirclesNamesInvalidName",
        "inputs": [
            { "name": "avatar", "type": "address", "internalType": "address" },
            { "name": "name", "type": "string", "internalType": "string" },
            { "name": "code", "type": "uint8", "internalType": "uint8" }
        ]
    },
    {
        "type": "error",
        "name": "CirclesNamesOrganizationHasNoSymbol",
        "inputs": [
            { "name": "organization", "type": "address", "internalType": "address" },
            { "name": "code", "type": "uint8", "internalType": "uint8" }
        ]
    },
    {
        "type": "error",
        "name": "CirclesNamesShortNameAlreadyAssigned",
        "inputs": [
            { "name": "avatar", "type": "address", "internalType": "address" },
            { "name": "shortName", "type": "uint72", "internalType": "uint72" },
            { "name": "code", "type": "uint8", "internalType": "uint8" }
        ]
    },
    {
        "type": "error",
        "name": "CirclesNamesShortNameWithNonceTaken",
        "inputs": [
            { "name": "avatar", "type": "address", "internalType": "address" },
            { "name": "nonce", "type": "uint256", "internalType": "uint256" },
            { "name": "shortName", "type": "uint72", "internalType": "uint72" },
            { "name": "takenByAvatar", "type": "address", "internalType": "address" }
        ]
    },
    {
        "type": "error",
        "name": "CirclesNamesShortNameZero",
        "inputs": [
            { "name": "avatar", "type": "address", "internalType": "address" },
            { "name": "nonce", "type": "uint256", "internalType": "uint256" }
        ]
    },
    { "type": "error", "name": "CirclesProxyAlreadyInitialized", "inputs": [] },
    {
        "type": "error",
        "name": "CirclesReentrancyGuard",
        "inputs": [{ "name": "code", "type": "uint8", "internalType": "uint8" }]
    }
] as const;