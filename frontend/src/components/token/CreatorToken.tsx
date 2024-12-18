import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTokenStore } from '../../hooks/useTokenstore';
import TokenHeader from './TokenHeader';
import PriceChart from './PriceChart';
import TradePanel from './TradePanel';
import TwitchEmbed from './TwitchEmbed';
import Comments from './Comments';

export default function CreatorToken() {
  // Get token address from URL
  const { tokenAddress } = useParams<{ tokenAddress: string }>();
  
  // Get all store values at once to avoid conditional hook calls
  const { tokens, isLoading, error, getTokenInfo } = useTokenStore();

  // Find the specific token using useMemo
  const token = useMemo(() => 
    tokens.find(t => 
      t.basicInfo.tokenAddress.toLowerCase() === tokenAddress?.toLowerCase()
    ),
    [tokens, tokenAddress]
  );

  // Format token data for components using useMemo
  const tokenInfo = useMemo(() => {
    if (!token) return null;
    return {
      creatorName: token.creatorInfo.twitchUsername,
      tokenTicker: token.basicInfo.symbol,
      twitchUrl: `https://twitch.tv/${token.creatorInfo.twitchUsername}`,
      profileUrl: token.creatorInfo.profileImageUrl,
      category: token.creatorInfo.category,
      curveType: getCurveType(token.basicInfo.curveType),
      currentPrice: 1.234, // You'll need to implement price fetching
      totalSupply: 1000000 // You'll need to implement supply fetching
    };
  }, [token]);

  // Mock wallet balance - could be moved to a separate hook
  const walletBalance = useMemo(() => ({
    tokenBalance: 100,
    mntBalance: 500
  }), []);

  // Fetch token if not found in store
  useEffect(() => {
    const fetchToken = async () => {
      if (!token && tokenAddress && !isLoading) {
        await getTokenInfo(tokenAddress);
      }
    };

    fetchToken();
  }, [tokenAddress, token, isLoading, getTokenInfo]);

  const handleBuy = (amount: number) => {
    console.log('Buying:', amount);
  };

  const handleSell = (amount: number) => {
    console.log('Selling:', amount);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  // Render not found state
  if (!token || !tokenInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Token not found</div>
      </div>
    );
  }

  // Render main content
  return (
    <div className="min-h-screen bg-gray-50">
      <TokenHeader 
        tokenInfo={tokenInfo} 
        walletBalance={walletBalance} 
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <PriceChart tokenInfo={tokenInfo} />
            <TwitchEmbed twitchUrl={tokenInfo.twitchUrl} />
            <Comments />
          </div>
          <div>
            <TradePanel
              tokenInfo={tokenInfo}
              onBuy={handleBuy}
              onSell={handleSell}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to convert curve type number to string
function getCurveType(curveType: number): "linear" | "exponential" | "logarithmic" | "sigmoid" {
  const curveTypes = ['linear', 'exponential', 'logarithmic', 'sigmoid'] as const;
  return curveTypes[curveType] || 'linear';
}

// Optional: Add debug component
const DebugInfo: React.FC<{ token: any }> = ({ token }) => {
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <details className="mt-8 p-4 bg-gray-100 rounded">
      <summary>Debug Information</summary>
      <pre className="mt-2 text-xs overflow-auto">
        {JSON.stringify(token, null, 2)}
      </pre>
    </details>
  );
};