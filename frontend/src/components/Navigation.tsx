import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Coins } from 'lucide-react';
export default function Navigation() {
  const location = useLocation();

  return (
    <nav className="bg-indigo-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Coins className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold">MantleMint</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/' ? 'bg-indigo-700' : 'hover:bg-indigo-500'
                }`}
              >
                Home
              </Link>
              <Link
                to="/create"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/create' ? 'bg-indigo-700' : 'hover:bg-indigo-500'
                }`}
              >
                Create Coin
              </Link>
              <Link
                to="/explore"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/explore' ? 'bg-indigo-700' : 'hover:bg-indigo-500'
                }`}
              >
                Explore
              </Link>
              <div>
              
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}