// frontend/src/components/landing/TokenSlider.tsx

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAllTokens } from '../../hooks/getAlltokens';
import { TokenInfo } from '../../types/token';

interface Token {
  id: string;
  name: string;
  ticker: string;
  price: number;
  change: number;
  imageUrl: string;
}

function TokenCard({ token }: { token: Token }) {
  return (
    <div className="w-64 p-4 bg-white rounded-xl shadow-lg mx-4 flex-shrink-0">
      <div className="flex items-center space-x-4">
        <img
          src={token.imageUrl}
          alt={token.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold">{token.name}</h3>
          <p className="text-sm text-gray-500">{token.ticker}</p>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">${token.price.toFixed(2)}</span>
          <span className={`text-sm ${token.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {token.change >= 0 ? '+' : ''}{token.change.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
}

function InfiniteSlider({ tokens, direction = 'left', speed = 25 }: { tokens: Token[]; direction?: 'left' | 'right'; speed?: number }) {
  const duplicatedTokens = useMemo(() => [...tokens, ...tokens, ...tokens], [tokens]);
  
  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="flex"
        animate={{
          x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%']
        }}
        transition={{
          x: {
            duration: speed,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop",
          },
        }}
        style={{ width: 'fit-content' }}
      >
        <div className="flex">
          {duplicatedTokens.map((token, idx) => (
            <TokenCard key={`${token.id}-${idx}`} token={token} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default function TokenSlider() {
  const { data, isLoading, isError } = useAllTokens();

  if (isLoading) {
    return <div>Loading tokens...</div>;
  }
  if (isError) {
    return <div>Error fetching tokens.</div>;
  }
  if (!data || data.length === 0) {
    return <div>No tokens found.</div>;
  }

  // Map TokenInfo to Token
  const tokens: Token[] = data.map((tokenInfo) => ({
    id: tokenInfo.tokenAddress,
    name: tokenInfo.name,
    ticker: tokenInfo.symbol,
    price: tokenInfo.price || 1, // Ensure price is a number
    change: tokenInfo.change || 1, // Ensure change is a number
    imageUrl:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8NpMfUyVGsyIx4nUsYDwy7OrEDr4Z_2xYog&s', // Default image if not provided
  }));

  return (
    <div className="relative py-8">
      {/* Gradient overlays to hide the edges */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />
      
      {/* Sliders */}
      <div className="space-y-8">
        <InfiniteSlider direction="left" speed={30} tokens={tokens} />
        <InfiniteSlider direction="right" speed={25} tokens={tokens} />
      </div>
    </div>
  );
}