import React, { useState } from 'react';
import { Rocket, Twitch, Link, GamepadIcon, Music, Palette, Trophy, GraduationCap, Cpu } from 'lucide-react';
import BondingCurveChart from './BondingCurveChart';

const categories = [
  { id: 'gaming', label: 'Gaming', icon: GamepadIcon },
  { id: 'just-chatting', label: 'Just Chatting', icon: Twitch },
  { id: 'music', label: 'Music', icon: Music },
  { id: 'art', label: 'Art', icon: Palette },
  { id: 'sports', label: 'Sports', icon: Trophy },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'technology', label: 'Technology', icon: Cpu },
] as const;

const bondingCurves = [
  'linear',
  'exponential',
  'logarithmic',
  'sigmoid',
] as const;

export default function CreateCoin() {
  const [category, setCategory] = useState<typeof categories[number]['id']>('gaming');
  const [curveType, setCurveType] = useState<typeof bondingCurves[number]>('linear');
  const [ticker, setTicker] = useState('');

  const handleTickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert to uppercase and remove any non-letter characters
    const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
    setTicker(value);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Create Your Creator Coin
        </h1>
        <p className="mt-2 text-gray-600">Launch your own token and connect with your community</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Navigation header */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Token Details</h2>
        </div>

        {/* Form content */}
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Creator Name</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 shadow-sm 
                         transition-all duration-200 
                         focus:border-indigo-500 focus:ring-indigo-500 focus:bg-white
                         hover:border-gray-400"
                placeholder="Your creator name"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Token Ticker
                <span className="text-xs text-gray-500 ml-2">(Capital letters only)</span>
              </label>
              <input
                type="text"
                value={ticker}
                onChange={handleTickerChange}
                maxLength={5}
                className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 shadow-sm 
                         transition-all duration-200 
                         focus:border-indigo-500 focus:ring-indigo-500 focus:bg-white
                         hover:border-gray-400 uppercase"
                placeholder="E.G., COIN"
              />
              {ticker && !/^[A-Z]+$/.test(ticker) && (
                <p className="text-red-500 text-xs mt-1">Only capital letters are allowed</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Twitch URL</label>
              <div className="mt-1 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Twitch className="h-5 w-5 text-indigo-500" />
                </div>
                <input
                  type="url"
                  className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 
                           transition-all duration-200
                           focus:border-indigo-500 focus:ring-indigo-500 focus:bg-white
                           hover:border-gray-400"
                  placeholder="https://twitch.tv/username"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Profile URL</label>
              <div className="mt-1 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Link className="h-5 w-5 text-indigo-500" />
                </div>
                <input
                  type="url"
                  className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 
                           transition-all duration-200
                           focus:border-indigo-500 focus:ring-indigo-500 focus:bg-white
                           hover:border-gray-400"
                  placeholder="Your website or social profile"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setCategory(id)}
                  className={`p-4 rounded-lg border transition-all duration-200 transform hover:scale-105 ${
                    category === id
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Icon className="h-6 w-6" />
                    <p className="font-medium text-sm">{label}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Bonding Curve Type</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {bondingCurves.map((curve) => (
                <button
                  key={curve}
                  onClick={() => setCurveType(curve)}
                  className={`p-4 rounded-lg border transition-all duration-200 transform hover:scale-105 ${
                    curveType === curve
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <p className="capitalize font-medium">{curve}</p>
                </button>
              ))}
            </div>
          </div>

          <BondingCurveChart curveType={curveType} />

          <button className="w-full flex items-center justify-center px-8 py-4 border border-transparent 
                        text-base font-medium rounded-lg text-white 
                        bg-gradient-to-r from-indigo-600 to-purple-600
                        transition-all duration-200 transform hover:scale-[1.02]
                        hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                        md:py-4 md:text-lg md:px-10">
            <Rocket className="mr-2" />
            Deploy Token
          </button>
        </div>
      </div>
    </div>
  );
}