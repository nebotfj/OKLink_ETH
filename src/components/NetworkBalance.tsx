import React from 'react';
import { NetworkBalance as NetworkBalanceType } from '../types';

interface NetworkBalanceProps {
  balance: NetworkBalanceType | null;
  isLoading: boolean;
}

export function NetworkBalance({ balance, isLoading }: NetworkBalanceProps) {
  if (isLoading) {
    return (
      <div className="mb-6 p-4 bg-white rounded-lg shadow animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      </div>
    );
  }

  if (!balance) return null;

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">Current Balance</h2>
      <p className="text-2xl font-bold">
        {balance.balance} {balance.symbol}
      </p>
    </div>
  );
}