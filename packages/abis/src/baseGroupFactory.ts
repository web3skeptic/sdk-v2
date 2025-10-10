/**
 * BaseGroupFactory Contract ABI
 */
export const baseGroupFactoryAbi = [
    {
        "type": "function",
        "name": "createBaseGroup",
        "inputs": [
            { "name": "_owner", "type": "address" },
            { "name": "_service", "type": "address" },
            { "name": "_feeCollection", "type": "address" },
            { "name": "_initialConditions", "type": "address[]" },
            { "name": "_name", "type": "string" },
            { "name": "_symbol", "type": "string" },
            { "name": "_metadataDigest", "type": "bytes32" }
        ],
        "outputs": [
            { "name": "group", "type": "address" },
            { "name": "mintHandler", "type": "address"},
            { "name": "treasury", "type": "address" }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "deployedByFactory",
        "inputs": [{ "name": "group", "type": "address" }],
        "outputs": [{ "name": "deployed", "type": "bool" }],
        "stateMutability": "view"
    },
    {
        "type": "event",
        "name": "BaseGroupCreated",
        "inputs": [
            { "name": "group", "type": "address", "indexed": true },
            { "name": "owner", "type": "address", "indexed": true },
            { "name": "mintHandler", "type": "address", "indexed": true },
            { "name": "treasury", "type": "address", "indexed": false }
        ],
        "anonymous": false
    },
    {
        "type": "error",
        "name": "MaxNameLength19",
        "inputs": []
    }
];
