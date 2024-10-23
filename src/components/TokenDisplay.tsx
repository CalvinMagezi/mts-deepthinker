import React from "react";

interface TokenDisplayProps {
  availableTokens: number;
  totalTokens: number;
}

const TokenDisplay: React.FC<TokenDisplayProps> = ({
  availableTokens,
  totalTokens,
}) => {
  return (
    <div className="bg-primary_black border border-brand_blue shadow-lg rounded-md p-4 w-64">
      <h2 className="text-lg font-semibold mb-2 text-brand_green">
        Token Usage
      </h2>
      <div className="space-y-2">
        <p className="flex justify-between">
          <span className="text-gray_text">Available Tokens:</span>
          <span className="font-medium text-brand_gray">
            {availableTokens.toLocaleString()}
          </span>
        </p>
        <p className="flex justify-between">
          <span className="text-gray_text">Total Tokens:</span>
          <span className="font-medium text-brand_gray">
            {totalTokens.toLocaleString()}
          </span>
        </p>
      </div>
    </div>
  );
};

export default TokenDisplay;
