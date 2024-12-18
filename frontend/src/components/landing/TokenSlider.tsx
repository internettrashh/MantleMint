// frontend/src/components/landing/TokenSlider.tsx

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTokenData } from '../../hooks/useTokenfetch';

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

function Loader() {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <motion.div
        className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
}

export default function TokenSlider() {
  const { tokens, isLoading, error } = useTokenData();

  if (isLoading) {
    return <Loader />;
  }
  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        Error fetching tokens: {error}
      </div>
    );
  }
  if (!tokens || tokens.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No tokens found.
      </div>
    );
  }

  // Map TokenInfo to Token with the new structure
  const formattedTokens: Token[] = tokens.map((tokenInfo) => ({
    id: tokenInfo.basicInfo.tokenAddress,
    name: tokenInfo.basicInfo.name,
    ticker: tokenInfo.basicInfo.symbol,
    price: 1, // You might want to get this from somewhere else
    change: 0, // You might want to get this from somewhere else
    imageUrl: tokenInfo.creatorInfo.profileImageUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8NpMfUyVGsyIx4nUsYDwy7OrEDr4Z_2xYog&s',
  }));

  return (
    <div className="relative py-8">
      {/* Gradient overlays to hide the edges */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />
      
      {/* Sliders */}
      <div className="space-y-8">
        <InfiniteSlider direction="left" speed={30} tokens={formattedTokens} />
        <InfiniteSlider direction="right" speed={25} tokens={formattedTokens} />
      </div>
    </div>
  );
}