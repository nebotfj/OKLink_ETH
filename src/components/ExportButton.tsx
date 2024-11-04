import React from 'react';

interface Props {
  network: string;
  address: string;
}

export function ExportButton({ network, address }: Props) {
  const handleExport = () => {
    window.location.href = `/.netlify/functions/api/export/${network}/${address}`;
  };

  return (
    <button
      onClick={handleExport}
      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
    >
      Export CSV
    </button>
  );
}