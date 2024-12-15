import React from 'react';
import { motion } from 'framer-motion';

interface Token {
  id: string;
  name: string;
  ticker: string;
  price: number;
  change: number;
  imageUrl: string;
}

const mockTokens: Token[] = [
  {
    id: '1',
    name: 'Gaming Pro',
    ticker: 'GPRO',
    price: 2.45,
    change: 5.2,
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop',
  },
  {
    id: '2',
    name: 'Art Master',
    ticker: 'ARTM',
    price: 1.78,
    change: -2.1,
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=100&h=100&fit=crop',
  },
  // Add more mock tokens as needed
];

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
          <p className="text-sm text-gray-500">${token.ticker}</p>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">${token.price.toFixed(2)}</span>
          <span className={`text-sm ${token.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {token.change >= 0 ? '+' : ''}{token.change}%
          </span>
        </div>
      </div>
    </div>
  );
}

function InfiniteSlider({ direction = 'left', speed = 25 }) {
  // Duplicate the tokens to create a seamless loop
  const duplicatedTokens = [...mockTokens, ...mockTokens, ...mockTokens];
  
  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="flex"
        animate={{
          x: direction === 'left' ? 
            ['0%', '-50%'] : 
            ['-50%', '0%']
        }}
        transition={{
          x: {
            duration: speed,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop",
          },
        }}
        style={{
          width: 'fit-content' // Allows the container to be as wide as needed
        }}
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
  return (
    <div className="relative py-8">
      {/* Add a gradient overlay to hide the edges */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />
      
      {/* Sliders */}
      <div className="space-y-8">
        <InfiniteSlider direction="left" speed={30} />
        <InfiniteSlider direction="right" speed={25} />
      </div>
    </div>
  );
}