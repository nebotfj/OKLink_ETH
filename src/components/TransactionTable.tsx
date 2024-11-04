import React from 'react';
import { Transaction } from '../types';
import { shortenAddress } from '../utils/helpers';

interface TransactionTableProps {
  transactions: Transaction[];
  searchAddress?: string;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ 
  transactions, 
  searchAddress 
}) => {
  const renderTransaction = (tx: Transaction) => {
    const isFromSearched = searchAddress?.toLowerCase() === tx.from?.toLowerCase();
    const isToSearched = searchAddress?.toLowerCase() === tx.to?.toLowerCase();
    const isLiquidityOp = tx.method.toLowerCase().includes('liquidity');
    const isSwap = tx.method === 'Swap';

    if (isLiquidityOp) {
      const rows = [];
      
      if (tx.inflowToken) {
        const inflows = tx.inflowToken.split(' + ');
        const inflowAmounts = tx.inflow ? tx.inflow.split(' + ') : [];
        
        inflows.forEach((token, i) => {
          rows.push(
            <tr key={`${tx.hash}-inflow-${i}`} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-mono">{tx.hash}</td>
              <td className="px-6 py-4 text-sm">
                <span className="font-semibold text-purple-600">{tx.method}</span>
              </td>
              <td className="px-6 py-4 text-sm font-mono">
                <span className={isFromSearched ? 'font-bold' : ''}>
                  {shortenAddress(tx.from)}
                </span>
              </td>
              <td className="px-6 py-4 text-sm font-mono">
                <span className={isToSearched ? 'font-bold' : ''}>
                  {shortenAddress(tx.to)}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-green-500">
                {`${inflowAmounts[i]} ${token}`}
              </td>
              <td className="px-6 py-4 text-sm text-red-500"></td>
              <td className="px-6 py-4 text-sm text-orange-500">
                {i === 0 ? tx.fee : ''}
              </td>
              <td className="px-6 py-4 text-sm whitespace-nowrap">{tx.timestamp}</td>
            </tr>
          );
        });
      }

      if (tx.outflowToken) {
        const outflows = tx.outflowToken.split(' + ');
        const outflowAmounts = tx.outflow ? tx.outflow.split(' + ') : [];
        
        outflows.forEach((token, i) => {
          rows.push(
            <tr key={`${tx.hash}-outflow-${i}`} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-mono">{tx.hash}</td>
              <td className="px-6 py-4 text-sm">
                <span className="font-semibold text-purple-600">{tx.method}</span>
              </td>
              <td className="px-6 py-4 text-sm font-mono">
                <span className={isFromSearched ? 'font-bold' : ''}>
                  {shortenAddress(tx.from)}
                </span>
              </td>
              <td className="px-6 py-4 text-sm font-mono">
                <span className={isToSearched ? 'font-bold' : ''}>
                  {shortenAddress(tx.to)}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-green-500"></td>
              <td className="px-6 py-4 text-sm text-red-500">
                {`${outflowAmounts[i]} ${token}`}
              </td>
              <td className="px-6 py-4 text-sm text-orange-500">
                {rows.length === 0 && i === 0 ? tx.fee : ''}
              </td>
              <td className="px-6 py-4 text-sm whitespace-nowrap">{tx.timestamp}</td>
            </tr>
          );
        });
      }

      return <React.Fragment key={tx.hash}>{rows}</React.Fragment>;
    }

    // For Swap transactions, combine inflow and outflow in one row
    if (isSwap) {
      return (
        <tr key={tx.hash} className="hover:bg-gray-50">
          <td className="px-6 py-4 text-sm font-mono">{tx.hash}</td>
          <td className="px-6 py-4 text-sm">
            <span className="font-semibold text-purple-600">{tx.method}</span>
          </td>
          <td className="px-6 py-4 text-sm font-mono">
            <span className={isFromSearched ? 'font-bold' : ''}>
              {shortenAddress(tx.from)}
            </span>
          </td>
          <td className="px-6 py-4 text-sm font-mono">
            <span className={isToSearched ? 'font-bold' : ''}>
              {shortenAddress(tx.to)}
            </span>
          </td>
          <td className="px-6 py-4 text-sm text-green-500">
            {tx.inflowToken && `${tx.inflow} ${tx.inflowToken}`}
          </td>
          <td className="px-6 py-4 text-sm text-red-500">
            {tx.outflowToken && `${tx.outflow} ${tx.outflowToken}`}
          </td>
          <td className="px-6 py-4 text-sm text-orange-500">{tx.fee}</td>
          <td className="px-6 py-4 text-sm whitespace-nowrap">{tx.timestamp}</td>
        </tr>
      );
    }

    // For regular transactions
    return (
      <tr key={tx.hash} className="hover:bg-gray-50">
        <td className="px-6 py-4 text-sm font-mono">{tx.hash}</td>
        <td className="px-6 py-4 text-sm">
          <span className="font-semibold text-purple-600">{tx.method}</span>
        </td>
        <td className="px-6 py-4 text-sm font-mono">
          <span className={isFromSearched ? 'font-bold' : ''}>
            {shortenAddress(tx.from)}
          </span>
        </td>
        <td className="px-6 py-4 text-sm font-mono">
          <span className={isToSearched ? 'font-bold' : ''}>
            {shortenAddress(tx.to)}
          </span>
        </td>
        <td className="px-6 py-4 text-sm text-green-500">
          {tx.inflowToken && `${tx.inflow} ${tx.inflowToken}`}
        </td>
        <td className="px-6 py-4 text-sm text-red-500">
          {tx.outflowToken && `${tx.outflow} ${tx.outflowToken}`}
        </td>
        <td className="px-6 py-4 text-sm text-orange-500">{tx.fee}</td>
        <td className="px-6 py-4 text-sm whitespace-nowrap">{tx.timestamp}</td>
      </tr>
    );
  };

  return (
    <div className="flex flex-col mt-8">
      <div className="overflow-x-auto">
        <div className="align-middle inline-block min-w-full">
          <div className="overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hash
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    From
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    To
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inflow Token
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Outflow Token
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fee
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map(renderTransaction)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;