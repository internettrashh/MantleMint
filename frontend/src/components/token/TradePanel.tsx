import React, { useState } from 'react';
import { TokenInfo } from '../../types/token';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface TradePanelProps {
  tokenInfo: TokenInfo;
  onBuy: (amount: number) => void;
  onSell: (amount: number) => void;
}

export default function TradePanel({ tokenInfo, onBuy, onSell }: TradePanelProps) {
  const [isBuying, setIsBuying] = useState(true);
  const [amount, setAmount] = useState('');

  const handleMax = () => {
    setAmount('100'); // This would be replaced with actual max calculation
  };

  const handleTrade = () => {
    const numAmount = parseFloat(amount);
    if (numAmount > 0) {
      if (isBuying) {
        onBuy(numAmount);
      } else {
        onSell(numAmount);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setIsBuying(true)}
          className={`flex-1 py-2 px-4 rounded-lg font-medium ${
            isBuying
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setIsBuying(false)}
          className={`flex-1 py-2 px-4 rounded-lg font-medium ${
            !isBuying
              ? 'bg-red-100 text-red-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Sell
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount ({isBuying ? 'MNT' : tokenInfo.tokenTicker})
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="block w-full pr-20 rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="0.00"
            />
            <button
              onClick={handleMax}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-medium text-indigo-600 hover:text-indigo-500"
            >
              MAX
            </button>
          </div>
        </div>

        <button
          onClick={handleTrade}
          className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 ${
            isBuying
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          {isBuying ? (
            <ArrowUpCircle className="h-5 w-5" />
          ) : (
            <ArrowDownCircle className="h-5 w-5" />
          )}
          <span>{isBuying ? 'Buy' : 'Sell'} {tokenInfo.tokenTicker}</span>
        </button>
      </div>
    </div>
  );
}