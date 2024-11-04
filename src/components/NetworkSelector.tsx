import React from 'react';
import { Network } from '../types';

interface NetworkSelectorProps {
  networks: Network[];
  activeNetworks: string[];
  selectedNetwork: string;
  onNetworkSelect: (network: string) => void;
}

export function NetworkSelector({
  networks,
  activeNetworks,
  selectedNetwork,
  onNetworkSelect
}: NetworkSelectorProps) {
  const activeNetworkData = networks.filter(n => activeNetworks.includes(n.id));

  if (!activeNetworkData.length) return null;

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3">Available Networks</h2>
      <div className="flex flex-wrap gap-2">
        {activeNetworkData.map(network => (
          <button
            key={network.id}
            onClick={() => onNetworkSelect(network.id)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              selectedNetwork === network.id
                ? 'bg-blue-600 text-white border-blue-700'
                : 'bg-white hover:bg-gray-50 border-gray-200'
            }`}
          >
            {network.name}
          </button>
        ))}
      </div>
    </div>
  );
}