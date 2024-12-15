import React from 'react';
import { TokenInfo, WalletBalance } from '../../types/token';
import { Wallet } from 'lucide-react';

interface TokenHeaderProps {
  tokenInfo: TokenInfo;
  walletBalance: WalletBalance;
}

export default function TokenHeader({ tokenInfo, walletBalance }: TokenHeaderProps) {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {tokenInfo.creatorName} ({tokenInfo.tokenTicker})
            </h1>
            <p className="text-gray-500">{tokenInfo.category}</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-sm text-gray-500">Current Price</p>
              <p className="text-lg font-semibold text-gray-900">{tokenInfo.currentPrice} MNT</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Wallet className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">{walletBalance.tokenBalance} {tokenInfo.tokenTicker}</p>
                  <p className="text-sm text-gray-500">{walletBalance.mntBalance} MNT</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}