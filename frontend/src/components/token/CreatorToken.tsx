import React from 'react';
import TokenHeader from './TokenHeader';
import PriceChart from './PriceChart';
import TradePanel from './TradePanel';
import TwitchEmbed from './TwitchEmbed';
import Comments from './Comments';

// Mock data - would be replaced with real data
const mockTokenInfo = {
  creatorName: "CryptoCreator",
  tokenTicker: "CCOIN",
  twitchUrl: "https://twitch.tv/example",
  profileUrl: "https://example.com",
  category: "Gaming",
  curveType: "exponential" as const,
  currentPrice: 1.234,
  totalSupply: 1000000
};

const mockWalletBalance = {
  tokenBalance: 100,
  mntBalance: 500
};

export default function CreatorToken() {
  const handleBuy = (amount: number) => {
    console.log('Buying:', amount);
  };

  const handleSell = (amount: number) => {
    console.log('Selling:', amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TokenHeader tokenInfo={mockTokenInfo} walletBalance={mockWalletBalance} />
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <PriceChart tokenInfo={mockTokenInfo} />
            <TwitchEmbed twitchUrl={mockTokenInfo.twitchUrl} />
            <Comments />
          </div>
          <div>
            <TradePanel
              tokenInfo={mockTokenInfo}
              onBuy={handleBuy}
              onSell={handleSell}
            />
          </div>
        </div>
      </div>
    </div>
  );
}