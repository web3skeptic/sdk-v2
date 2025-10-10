import { narrow } from 'abitype';

/**
 * BaseGroupFactory Contract ABI
 */
export const baseGroupFactoryAbi = narrow([
    {
        "type": "function",
        "name": "createBaseGroup",
        "inputs": [
            { "name": "_owner", "type": "address", "internalType": "address" },
            { "name": "_service", "type": "address", "internalType": "address" },
            { "name": "_feeCollection", "type": "address", "internalType": "address" },
            { "name": "_initialConditions", "type": "address[]", "internalType": "address[]" },
            { "name": "_name", "type": "string", "internalType": "string" },
            { "name": "_symbol", "type": "string", "internalType": "string" },
            { "name": "_metadataDigest", "type": "bytes32", "internalType": "bytes32" }
        ],
        "outputs": [
            { "name": "group", "type": "address", "internalType": "address" },
            { "name": "mintHandler", "type": "address", "internalType": "address" },
            { "name": "treasury", "type": "address", "internalType": "address" }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "deployedByFactory",
        "inputs": [{ "name": "group", "type": "address", "internalType": "address" }],
        "outputs": [{ "name": "deployed", "type": "bool", "internalType": "bool" }],
        "stateMutability": "view"
    },
    {
        "type": "event",
        "name": "BaseGroupCreated",
        "inputs": [
            { "name": "group", "type": "address", "indexed": true, "internalType": "address" },
            { "name": "owner", "type": "address", "indexed": true, "internalType": "address" },
            { "name": "mintHandler", "type": "address", "indexed": true, "internalType": "address" },
            { "name": "treasury", "type": "address", "indexed": false, "internalType": "address" }
        ],
        "anonymous": false
    },
    {
        "type": "error",
        "name": "MaxNameLength19",
        "inputs": []
    }
]);
