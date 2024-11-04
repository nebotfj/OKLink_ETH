export interface Transaction {
  hash: string;
  method: string;
  from: string;
  to: string;
  inflow: string | null;
  inflowToken: string | null;
  outflow: string | null;
  outflowToken: string | null;
  fee?: string | null;
  timestamp: string;
}

export interface ApiTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: string;
  functionName?: string;
  isError?: string;
  input: string;
  gasUsed?: string;
  gasPrice?: string;
}

export interface ApiResponse {
  status: string;
  message: string;
  result: ApiTransaction[];
}