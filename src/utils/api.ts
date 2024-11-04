import axios, { AxiosError } from 'axios';
import { Transaction } from '../types';
import { formatBalance } from './helpers';
import { RateLimiter } from './rateLimit';
import { UNISWAP_V2_METHODS, TRANSFER_TYPES } from '../constants/transactionTypes';

const API_KEY = 'c0adfa1e-da7a-4628-bf5f-0b7a2f43e898';
const BASE_URL = 'https://www.oklink.com/api/v5/explorer/eth/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Ok-Access-Key': API_KEY,
    'Accept': 'application/json'
  }
});

const rateLimiter = new RateLimiter(3);

function getMethodType(input: string, functionName: string): string {
  if (!input || input.length < 10) return functionName || 'Transfer';
  
  const methodId = input.slice(0, 10).toLowerCase();

  // Check for Liquidity Operations
  if (methodId === UNISWAP_V2_METHODS.ADD_LIQUIDITY.signature) return 'Add Liquidity';
  if (methodId === UNISWAP_V2_METHODS.ADD_LIQUIDITY_ETH.signature) return 'Add Liquidity ETH';
  if (methodId === UNISWAP_V2_METHODS.REMOVE_LIQUIDITY.signature) return 'Remove Liquidity';
  if (methodId === UNISWAP_V2_METHODS.REMOVE_LIQUIDITY_ETH.signature) return 'Remove Liquidity ETH';

  // Check for Swaps
  if (Object.values(UNISWAP_V2_METHODS).some(m => 
    m.signature === methodId && m.description.includes('Swap'))) {
    return 'Swap';
  }

  return functionName || 'Transfer';
}

function isLiquidityOperation(method: string): boolean {
  return method.toLowerCase().includes('liquidity');
}

const calculateFee = (gasUsed: string, gasPrice: string): string => {
  if (!gasUsed || !gasPrice) return '0';
  const fee = (BigInt(gasUsed) * BigInt(gasPrice)) / BigInt(10 ** 18);
  return formatBalance(fee.toString(), 18, 12); // Show 12 decimals for fees
};

async function fetchTransactions(address: string): Promise<Transaction[]> {
  try {
    const [normalTxs, tokenTxs] = await Promise.all([
      rateLimiter.enqueue(() => 
        api.get('', {
          params: {
            module: 'account',
            action: 'txlist',
            address,
            startblock: '0',
            endblock: '99999999',
            page: '1',
            offset: '100',
            sort: 'desc'
          }
        })
      ),
      rateLimiter.enqueue(() => 
        api.get('', {
          params: {
            module: 'account',
            action: 'tokentx',
            address,
            startblock: '0',
            endblock: '99999999',
            page: '1',
            offset: '100',
            sort: 'desc'
          }
        })
      )
    ]);

    const transactions = new Map<string, Transaction>();

    // Process normal transactions
    normalTxs.data?.result?.forEach((tx: any) => {
      const method = getMethodType(tx.input, tx.functionName);
      const isInflow = tx.to?.toLowerCase() === address.toLowerCase();
      const value = formatBalance(tx.value || '0', 18);
      const fee = calculateFee(tx.gasUsed || '0', tx.gasPrice || '0');

      transactions.set(tx.hash, {
        hash: tx.hash,
        method,
        from: tx.from,
        to: tx.to,
        inflow: isInflow ? value : null,
        inflowToken: isInflow ? 'ETH' : null,
        outflow: !isInflow ? value : null,
        outflowToken: !isInflow ? 'ETH' : null,
        fee,
        timestamp: new Date(parseInt(tx.timeStamp) * 1000).toLocaleString()
      });
    });

    // Process token transactions
    tokenTxs.data?.result?.forEach((tx: any) => {
      const existingTx = transactions.get(tx.hash);
      const isInflow = tx.to?.toLowerCase() === address.toLowerCase();
      const value = formatBalance(tx.value || '0', parseInt(tx.tokenDecimal || '18'));
      const method = existingTx?.method || getMethodType(tx.input, tx.functionName);
      const isLiquidity = isLiquidityOperation(method);

      // Special handling for LP tokens
      const isLPToken = tx.tokenSymbol?.includes('UNI-V2') || 
                       tx.tokenSymbol?.includes('SLP') ||
                       tx.tokenSymbol?.includes('CAKE-LP');

      if (existingTx) {
        // For liquidity operations, create separate rows
        if (isLiquidity || isLPToken) {
          if (isInflow) {
            existingTx.inflow = value;
            existingTx.inflowToken = tx.tokenSymbol;
          } else {
            existingTx.outflow = value;
            existingTx.outflowToken = tx.tokenSymbol;
          }
        } else {
          // For regular token transfers and swaps
          if (isInflow) {
            existingTx.inflow = value;
            existingTx.inflowToken = tx.tokenSymbol;
          } else {
            existingTx.outflow = value;
            existingTx.outflowToken = tx.tokenSymbol;
          }
        }
      } else {
        transactions.set(tx.hash, {
          hash: tx.hash,
          method,
          from: tx.from,
          to: tx.to,
          inflow: isInflow ? value : null,
          inflowToken: isInflow ? tx.tokenSymbol : null,
          outflow: !isInflow ? value : null,
          outflowToken: !isInflow ? tx.tokenSymbol : null,
          fee: calculateFee(tx.gasUsed || '0', tx.gasPrice || '0'),
          timestamp: new Date(parseInt(tx.timeStamp) * 1000).toLocaleString()
        });
      }
    });

    return Array.from(transactions.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('API Error:', error.response?.data || error.message);
    } else {
      console.error('Error fetching transactions:', error);
    }
    return [];
  }
}

export { fetchTransactions };