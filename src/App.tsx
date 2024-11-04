import React, { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { TransactionTable } from './components/TransactionTable';
import { fetchTransactions } from './utils/api';
import { Transaction } from './types';

function App() {
  const [address, setAddress] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!address) return;
    setIsLoading(true);
    try {
      const txs = await fetchTransactions(address);
      setTransactions(txs);
    } catch (error) {
      console.error('Error:', error);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">OKLink Explorer</h1>
        
        <SearchBar
          address={address}
          setAddress={setAddress}
          onSearch={handleSearch}
          isLoading={isLoading}
        />

        <TransactionTable 
          transactions={transactions}
          isLoading={isLoading}
          searchAddress={address}
        />
      </div>
    </div>
  );
}

export default App;