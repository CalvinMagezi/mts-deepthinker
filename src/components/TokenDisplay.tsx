import React from 'react';
import { apiToCustomTokens } from '../utils/tokenCalculator';

interface TokenDisplayProps {
  apiTokensUsed: number;
  totalCost: number;
  availableCustomTokens: number;
  ipAddress: string;
}

const TokenDisplay: React.FC<TokenDisplayProps> = ({ apiTokensUsed, totalCost, availableCustomTokens, ipAddress }) => {
  const customTokensUsed = apiToCustomTokens(apiTokensUsed);

  return (
    <div className="bg-primary_black border border-brand_blue shadow-lg rounded-md p-4 w-64">
      <h2 className="text-lg font-semibold mb-2 text-brand_green">Usage Statistics</h2>
      <div className="space-y-2">
        <p className="flex justify-between">
          <span className="text-gray_text">API Tokens Used:</span>
          <span className="font-medium text-brand_gray">{apiTokensUsed.toLocaleString()}</span>
        </p>
        <p className="flex justify-between">
          <span className="text-gray_text">Custom Tokens Used:</span>
          <span className="font-medium text-brand_gray">{customTokensUsed.toLocaleString()}</span>
        </p>
        <p className="flex justify-between">
          <span className="text-gray_text">Available Custom Tokens:</span>
          <span className="font-medium text-brand_gray">{availableCustomTokens.toLocaleString()}</span>
        </p>
        <p className="flex justify-between">
          <span className="text-gray_text">Total Cost:</span>
          <span className="font-medium text-brand_blue">${totalCost.toFixed(6)}</span>
        </p>
      </div>
      <p className="text-xs text-gray_text mt-4">IP: {ipAddress}</p>
    </div>
  );
};

export default TokenDisplay;