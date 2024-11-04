/**
 * Common EVM Transaction Types and Methods
 * 
 * This file documents the various types of transactions that can occur on EVM chains,
 * including their method signatures and descriptions.
 */

// Basic Transfer Types
export const TRANSFER_TYPES = {
  NATIVE_TRANSFER: {
    signature: null, // No method signature for native transfers
    description: 'Direct transfer of native chain token (ETH, BNB, etc.)'
  },
  ERC20_TRANSFER: {
    signature: '0xa9059cbb',
    description: 'Standard ERC20 token transfer'
  },
  ERC20_TRANSFER_FROM: {
    signature: '0x23b872dd',
    description: 'ERC20 transfer on behalf of another address (requires approval)'
  }
} as const;

// Uniswap V2 and Compatible DEX Methods
export const UNISWAP_V2_METHODS = {
  // Swapping Methods
  SWAP_EXACT_TOKENS_FOR_TOKENS: {
    signature: '0x38ed1739',
    description: 'Swap exact amount of input tokens for output tokens'
  },
  SWAP_TOKENS_FOR_EXACT_TOKENS: {
    signature: '0x8803dbee',
    description: 'Swap tokens for exact amount of output tokens'
  },
  SWAP_EXACT_ETH_FOR_TOKENS: {
    signature: '0x7ff36ab5',
    description: 'Swap exact amount of ETH for tokens'
  },
  SWAP_TOKENS_FOR_EXACT_ETH: {
    signature: '0x4a25d94a',
    description: 'Swap tokens for exact amount of ETH'
  },
  SWAP_EXACT_TOKENS_FOR_ETH: {
    signature: '0x18cbafe5',
    description: 'Swap exact amount of tokens for ETH'
  },
  SWAP_ETH_FOR_EXACT_TOKENS: {
    signature: '0xfb3bdb41',
    description: 'Swap ETH for exact amount of tokens'
  },

  // Liquidity Methods
  ADD_LIQUIDITY: {
    signature: '0xe8e33700',
    description: 'Add liquidity to token-token pair'
  },
  ADD_LIQUIDITY_ETH: {
    signature: '0xf305d719',
    description: 'Add liquidity to ETH-token pair'
  },
  REMOVE_LIQUIDITY: {
    signature: '0xbaa2abde',
    description: 'Remove liquidity from token-token pair'
  },
  REMOVE_LIQUIDITY_ETH: {
    signature: '0x02751cec',
    description: 'Remove liquidity from ETH-token pair'
  }
} as const;

// Uniswap V3 Methods
export const UNISWAP_V3_METHODS = {
  MINT: {
    signature: '0x88316456',
    description: 'Create new position and mint NFT'
  },
  INCREASE_LIQUIDITY: {
    signature: '0x219f5d17',
    description: 'Add liquidity to existing position'
  },
  DECREASE_LIQUIDITY: {
    signature: '0x0c49ccbe',
    description: 'Remove liquidity from existing position'
  },
  COLLECT: {
    signature: '0x4f1eb3d8',
    description: 'Collect accumulated fees'
  }
} as const;

// ERC721 (NFT) Methods
export const ERC721_METHODS = {
  TRANSFER: {
    signature: '0x23b872dd',
    description: 'Transfer NFT'
  },
  SAFE_TRANSFER: {
    signature: '0x42842e0e',
    description: 'Safe NFT transfer'
  },
  MINT: {
    signature: '0x40c10f19',
    description: 'Mint NFT'
  },
  BURN: {
    signature: '0x42966c68',
    description: 'Burn NFT'
  }
} as const;

// ERC1155 (Multi Token) Methods
export const ERC1155_METHODS = {
  TRANSFER_SINGLE: {
    signature: '0xf242432a',
    description: 'Transfer single token'
  },
  TRANSFER_BATCH: {
    signature: '0x2eb2c2d6',
    description: 'Transfer multiple tokens'
  }
} as const;

// Token Approval Methods
export const APPROVAL_METHODS = {
  ERC20_APPROVE: {
    signature: '0x095ea7b3',
    description: 'ERC20 token approval'
  },
  ERC721_APPROVE: {
    signature: '0x095ea7b3',
    description: 'NFT approval'
  },
  ERC721_APPROVE_ALL: {
    signature: '0xa22cb465',
    description: 'NFT approval for all'
  }
} as const;

/**
 * Helper function to identify transaction type from method signature
 */
export function identifyTransactionType(methodId: string): string {
  if (!methodId) return 'Transfer';
  
  // Remove 0x prefix if present
  methodId = methodId.toLowerCase().startsWith('0x') ? 
    methodId.slice(2).toLowerCase() : 
    methodId.toLowerCase();

  // Check all method collections
  const allMethods = {
    ...TRANSFER_TYPES,
    ...UNISWAP_V2_METHODS,
    ...UNISWAP_V3_METHODS,
    ...ERC721_METHODS,
    ...ERC1155_METHODS,
    ...APPROVAL_METHODS
  };

  // Find matching method
  for (const [category, methods] of Object.entries(allMethods)) {
    for (const [methodName, data] of Object.entries(methods)) {
      if (data.signature?.toLowerCase() === methodId) {
        return data.description;
      }
    }
  }

  return 'Unknown Method';
}