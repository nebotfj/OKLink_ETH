import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  address: string;
  setAddress: (address: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export function SearchBar({ address, setAddress, onSearch, isLoading }: SearchBarProps) {
  return (
    <div className="flex gap-2 mb-6">
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter wallet address (0x...)"
        className="flex-1 px-4 py-2 rounded border"
      />
      <button
        onClick={onSearch}
        disabled={!address || isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2 disabled:opacity-50"
      >
        <Search size={20} />
        Search
      </button>
    </div>
  );
}