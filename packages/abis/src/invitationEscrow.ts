/**
 * InvitationEscrow Contract ABI
 */
export const invitationEscrowAbi = [
  {
    "type": "function",
    "name": "redeemInvitation",
    "inputs": [
      { "name": "inviter", "type": "address" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "revokeInvitation",
    "inputs": [
      { "name": "invitee", "type": "address" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "revokeAllInvitations",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "onERC1155Received",
    "inputs": [
      { "name": "operator", "type": "address" },
      { "name": "from", "type": "address" },
      { "name": "id", "type": "uint256" },
      { "name": "value", "type": "uint256" },
      { "name": "data", "type": "bytes" }
    ],
    "outputs": [
      { "name": "", "type": "bytes4" }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getInviters",
    "inputs": [
      { "name": "invitee", "type": "address" }
    ],
    "outputs": [
      { "name": "inviters", "type": "address[]" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getInvitees",
    "inputs": [
      { "name": "inviter", "type": "address" }
    ],
    "outputs": [
      { "name": "invitees", "type": "address[]" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getEscrowedAmountAndDays",
    "inputs": [
      { "name": "inviter", "type": "address" },
      { "name": "invitee", "type": "address" }
    ],
    "outputs": [
      { "name": "escrowedAmount", "type": "uint256" },
      { "name": "days_", "type": "uint64" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "InvitationEscrowed",
    "inputs": [
      { "name": "inviter", "type": "address", "indexed": true },
      { "name": "invitee", "type": "address", "indexed": true },
      { "name": "amount", "type": "uint256", "indexed": true }
    ]
  },
  {
    "type": "event",
    "name": "InvitationRedeemed",
    "inputs": [
      { "name": "inviter", "type": "address", "indexed": true },
      { "name": "invitee", "type": "address", "indexed": true },
      { "name": "amount", "type": "uint256", "indexed": true }
    ]
  },
  {
    "type": "event",
    "name": "InvitationRefunded",
    "inputs": [
      { "name": "inviter", "type": "address", "indexed": true },
      { "name": "invitee", "type": "address", "indexed": true },
      { "name": "amount", "type": "uint256", "indexed": true }
    ]
  },
  {
    "type": "event",
    "name": "InvitationRevoked",
    "inputs": [
      { "name": "inviter", "type": "address", "indexed": true },
      { "name": "invitee", "type": "address", "indexed": true },
      { "name": "amount", "type": "uint256", "indexed": true }
    ]
  },
  {
    "type": "error",
    "name": "OnlyHub",
    "inputs": []
  },
  {
    "type": "error",
    "name": "OnlyHumanAvatarsAreInviters",
    "inputs": []
  },
  {
    "type": "error",
    "name": "OnlyInviter",
    "inputs": []
  },
  {
    "type": "error",
    "name": "EscrowedCRCAmountOutOfRange",
    "inputs": [
      { "name": "received", "type": "uint256" }
    ]
  },
  {
    "type": "error",
    "name": "InvalidEncoding",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InviteeAlreadyRegistered",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidInvitee",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InviteAlreadyEscrowed",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidEscrow",
    "inputs": []
  },
  {
    "type": "error",
    "name": "MissingOrExpiredTrust",
    "inputs": []
  }
] as const;
