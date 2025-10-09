/**
 * BaseGroup Contract ABI
 */
export const baseGroupAbi = [
    {
        "type": "constructor",
        "inputs": [
            { "name": "_owner", "type": "address", "internalType": "address" },
            { "name": "_service", "type": "address", "internalType": "address" },
            { "name": "_feeCollection", "type": "address", "internalType": "address" },
            { "name": "_initialConditions", "type": "address[]", "internalType": "address[]" },
            { "name": "_name", "type": "string", "internalType": "string" },
            { "name": "_symbol", "type": "string", "internalType": "string" },
            { "name": "_metadataDigest", "type": "bytes32", "internalType": "bytes32" }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "BASE_MINT_HANDLER",
        "inputs": [],
        "outputs": [{ "name": "", "type": "address", "internalType": "contract BaseMintHandler" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "BASE_MINT_POLICY",
        "inputs": [],
        "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "BASE_TREASURY",
        "inputs": [],
        "outputs": [{ "name": "", "type": "address", "internalType": "contract BaseTreasury" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "HUB",
        "inputs": [],
        "outputs": [{ "name": "", "type": "address", "internalType": "contract IHub" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "LIFT_ERC20",
        "inputs": [],
        "outputs": [{ "name": "", "type": "address", "internalType": "contract ILiftERC20" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "MAX_CONDITIONS",
        "inputs": [],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "NAME_REGISTRY",
        "inputs": [],
        "outputs": [{ "name": "", "type": "address", "internalType": "contract INameRegistry" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "feeCollection",
        "inputs": [],
        "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getMembershipConditions",
        "inputs": [],
        "outputs": [{ "name": "", "type": "address[]", "internalType": "address[]" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "membershipConditions",
        "inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "owner",
        "inputs": [],
        "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "registerShortNameWithNonce",
        "inputs": [{ "name": "_nonce", "type": "uint256", "internalType": "uint256" }],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "service",
        "inputs": [],
        "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "setFeeCollection",
        "inputs": [{ "name": "_feeCollection", "type": "address", "internalType": "address" }],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "setMembershipCondition",
        "inputs": [
            { "name": "_condition", "type": "address", "internalType": "address" },
            { "name": "_enabled", "type": "bool", "internalType": "bool" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "setOwner",
        "inputs": [{ "name": "_owner", "type": "address", "internalType": "address" }],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "setService",
        "inputs": [{ "name": "_service", "type": "address", "internalType": "address" }],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "trust",
        "inputs": [
            { "name": "_trustReceiver", "type": "address", "internalType": "address" },
            { "name": "_expiry", "type": "uint96", "internalType": "uint96" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "trustBatchWithConditions",
        "inputs": [
            { "name": "_members", "type": "address[]", "internalType": "address[]" },
            { "name": "_expiry", "type": "uint96", "internalType": "uint96" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
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
        "name": "FeeCollectionUpdated",
        "inputs": [
            { "name": "feeCollection", "type": "address", "indexed": true, "internalType": "address" }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "MembershipConditionEnabled",
        "inputs": [
            { "name": "condition", "type": "address", "indexed": true, "internalType": "address" },
            { "name": "enabled", "type": "bool", "indexed": false, "internalType": "bool" }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "OwnerUpdated",
        "inputs": [
            { "name": "owner", "type": "address", "indexed": true, "internalType": "address" }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "ServiceUpdated",
        "inputs": [
            { "name": "newService", "type": "address", "indexed": true, "internalType": "address" }
        ],
        "anonymous": false
    },
    {
        "type": "error",
        "name": "InvalidCallingParameters",
        "inputs": []
    },
    {
        "type": "error",
        "name": "MaxConditionsActive",
        "inputs": []
    },
    {
        "type": "error",
        "name": "MembershipCheckFailed",
        "inputs": [
            { "name": "member", "type": "address", "internalType": "address" },
            { "name": "failedCondition", "type": "address", "internalType": "address" }
        ]
    },
    {
        "type": "error",
        "name": "OnlyHub",
        "inputs": []
    },
    {
        "type": "error",
        "name": "OnlyOwner",
        "inputs": []
    },
    {
        "type": "error",
        "name": "OnlyOwnerOrService",
        "inputs": []
    }
] as const;
