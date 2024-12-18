import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTokenStore } from '../../hooks/useTokenstore';

interface TokenSuggestion {
  name: string;
  symbol: string;
  tokenAddress: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<TokenSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const tokens = useTokenStore(state => state.tokens);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filterTokens = (searchQuery: string) => {
    if (!searchQuery) return [];
    const lowercaseQuery = searchQuery.toLowerCase();
    return tokens
      .filter(token => 
        token.basicInfo.name.toLowerCase().includes(lowercaseQuery) ||
        token.basicInfo.symbol.toLowerCase().includes(lowercaseQuery)
      )
      .map(token => ({
        name: token.basicInfo.name,
        symbol: token.basicInfo.symbol,
        tokenAddress: token.basicInfo.tokenAddress
      }))
      .slice(0, 5);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      navigate(`/token/${suggestions[0].tokenAddress}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    const filtered = filterTokens(value);
    setSuggestions(filtered);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (tokenAddress: string) => {
    navigate(`/token/${tokenAddress}`);
    setShowSuggestions(false);
    setQuery('');
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
            className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-indigo-100 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-white shadow-lg"
            placeholder="Search for creator coins..."
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-gray-400" />
          </div>
        </div>
        
        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div 
            ref={suggestionsRef}
            className="absolute mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          >
            {suggestions.map((token) => (
              <div
                key={token.tokenAddress}
                onClick={() => handleSuggestionClick(token.tokenAddress)}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
              >
                <span className="font-medium">{token.name}</span>
                <span className="text-gray-500 text-sm">{token.symbol}</span>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Search
        </button>
      </form>
    </div>
  );
}