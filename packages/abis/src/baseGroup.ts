import { narrow } from 'abitype';

/**
 * BaseGroup Contract ABI
 */
export const baseGroupAbi = narrow([
    {
        "type": "constructor",
        "inputs": [
            { "name": "_owner", "type": "address"},
            { "name": "_service", "type": "address"},
            { "name": "_feeCollection", "type": "address" },
            { "name": "_initialConditions", "type": "address[]" },
            { "name": "_name", "type": "string" },
            { "name": "_symbol", "type": "string" },
            { "name": "_metadataDigest", "type": "bytes32" }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "BASE_MINT_HANDLER",
        "inputs": [],
        "outputs": [{ "name": "", "type": "address" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "BASE_MINT_POLICY",
        "inputs": [],
        "outputs": [{ "name": "", "type": "address" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "BASE_TREASURY",
        "inputs": [],
        "outputs": [{ "name": "", "type": "address" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "HUB",
        "inputs": [],
        "outputs": [{ "name": "", "type": "address" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "LIFT_ERC20",
        "inputs": [],
        "outputs": [{ "name": "", "type": "address" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "MAX_CONDITIONS",
        "inputs": [],
        "outputs": [{ "name": "", "type": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "NAME_REGISTRY",
        "inputs": [],
        "outputs": [{ "name": "", "type": "address" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "feeCollection",
        "inputs": [],
        "outputs": [{ "name": "", "type": "address" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getMembershipConditions",
        "inputs": [],
        "outputs": [{ "name": "", "type": "address[]" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "membershipConditions",
        "inputs": [{ "name": "", "type": "uint256" }],
        "outputs": [{ "name": "", "type": "address" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "owner",
        "inputs": [],
        "outputs": [{ "name": "", "type": "address" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "registerShortNameWithNonce",
        "inputs": [{ "name": "_nonce", "type": "uint256" }],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "service",
        "inputs": [],
        "outputs": [{ "name": "", "type": "address" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "setFeeCollection",
        "inputs": [{ "name": "_feeCollection", "type": "address" }],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "setMembershipCondition",
        "inputs": [
            { "name": "_condition", "type": "address" },
            { "name": "_enabled", "type": "bool" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "setOwner",
        "inputs": [{ "name": "_owner", "type": "address" }],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "setService",
        "inputs": [{ "name": "_service", "type": "address" }],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "trust",
        "inputs": [
            { "name": "_trustReceiver", "type": "address" },
            { "name": "_expiry", "type": "uint96" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "trustBatchWithConditions",
        "inputs": [
            { "name": "_members", "type": "address[]" },
            { "name": "_expiry", "type": "uint96" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "updateMetadataDigest",
        "inputs": [{ "name": "_metadataDigest", "type": "bytes32" }],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "event",
        "name": "FeeCollectionUpdated",
        "inputs": [
            { "name": "feeCollection", "type": "address", "indexed": true }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "MembershipConditionEnabled",
        "inputs": [
            { "name": "condition", "type": "address", "indexed": true },
            { "name": "enabled", "type": "bool", "indexed": false }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "OwnerUpdated",
        "inputs": [
            { "name": "owner", "type": "address", "indexed": true }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "ServiceUpdated",
        "inputs": [
            { "name": "newService", "type": "address", "indexed": true }
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
            { "name": "member", "type": "address" },
            { "name": "failedCondition", "type": "address" }
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
]);