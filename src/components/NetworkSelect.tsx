import React from 'react';
import { NetworkOption } from '../types';

interface Props {
  value: string;
  onChange: (value: string) => void;
  networks: NetworkOption[];
  disabled?: boolean;
}

export function NetworkSelect({ value, onChange, networks, disabled }: Props) {
  return (
    <div>
      <label htmlFor="network" className="block text-sm font-medium text-gray-700 mb-1">
        Active Networks
      </label>
      <select
        id="network"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <option value="">Select Network</option>
        {networks.map(network => (
          <option key={network.id} value={network.id}>
            {network.name} ({network.symbol})
          </option>
        ))}
      </select>
    </div>
  );
}