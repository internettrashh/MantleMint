import TokenSlider from './TokenSlider';
import SearchBar from './SearchBar';
import { Coins } from 'lucide-react';
import { useTokenData } from '../../hooks/useTokenfetch';

export default function LandingPage() {
  const { tokens, isLoading, error } = useTokenData();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero Section */}
      <div className="pt-20 pb-16 text-center">
        <div className="flex justify-center mb-6">
          <Coins className="h-16 w-16 text-indigo-600" />
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Discover Creator Coins
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto px-4">
          Invest in your favorite creators and be part of their journey
        </p>
      </div>

      {/* Search Section */}
      <div className="mb-16">
        <SearchBar />
      </div>

      {/* Sliding Tokens */}
      <div className="overflow-hidden">
        <TokenSlider />
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <h3 className="text-xl font-semibold mb-2">Transparent Pricing</h3>
            <p className="text-gray-600">Bonding curves ensure fair and predictable token prices</p>
          </div>
          <div className="text-center p-6">
            <h3 className="text-xl font-semibold mb-2">Direct Support</h3>
            <p className="text-gray-600">Support creators directly by investing in their tokens</p>
          </div>
          <div className="text-center p-6">
            <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
            <p className="text-gray-600">Join communities of like-minded supporters</p>
          </div>
        </div>
      </div>

      {/* Token Display Section */}
      {isLoading && <div>Loading tokens...</div>}
      {error && <div>Error: {error}</div>}
      {tokens && tokens.map((token, index) => (
        <div key={token.basicInfo.tokenAddress || index}>
          <h3>{token.basicInfo.name}</h3>
          <p>Symbol: {token.basicInfo.symbol}</p>
          <p>Address: {token.basicInfo.tokenAddress}</p>
          <p>Creator: {token.basicInfo.creator}</p>
          {/* Add other token information you want to display */}
        </div>
      ))}
    </div>
  );
}