import React from 'react';
import { NetworkBalance } from '../types';

interface Props {
  balance: NetworkBalance;
}

export function BalanceDisplay({ balance }: Props) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-2">Balance</h2>
      <p className="text-lg">
        {balance.balance} {balance.symbol}
      </p>
    </div>
  );
}