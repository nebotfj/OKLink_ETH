export interface Network {
  id: string;
  name: string;
  symbol: string;
}

export interface Transaction {
  hash: string;
  method: string;
  from: string;
  to: string;
  value: string;
  nativeToken: string;
  inflow: string | null;
  inflowToken: string | null;
  outflow: string | null;
  outflowToken: string | null;
  timestamp: string;
}

export interface TokenBalance {
  symbol: string;
  balance: string;
  decimals: string;
  name: string;
  contract: string;
}

export interface NFTBalance {
  collection: string;
  tokenId: string;
  name: string;
  contract: string;
}

export interface Balance {
  network: string;
  nativeBalance: string;
  symbol: string;
  tokens: TokenBalance[];
  nfts: NFTBalance[];
}