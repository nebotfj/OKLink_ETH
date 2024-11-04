import React from 'react';
import { Search } from 'lucide-react';

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  isLoading?: boolean;
}

export function AddressInput({ value, onChange, onSearch, isLoading }: AddressInputProps) {
  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter EVM wallet address (0x...)"
        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
      />
      <button
        onClick={onSearch}
        disabled={!value || isLoading}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Search size={20} />
        )}
        Search
      </button>
    </div>
  );
}