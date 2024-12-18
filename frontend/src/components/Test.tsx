// frontend/src/components/TokenList.tsx
import React from 'react';
import { useTokenFactory } from '../hooks/useTokenFactory';
import './TokenList.css';

interface BasicTokenInfo {
  tokenAddress: string;
  name: string;
  symbol: string;
  description: string;
  curveType: number;
  curveAddress: string;
  paymentToken: string;
  createdAt: number;
  creator: string;
}

interface CreatorInfo {
  twitchUsername: string;
  socialLinks: string[];
  profileImageUrl: string;
  category: string;
}

interface TokenInfo {
  basicInfo: BasicTokenInfo;
  creatorInfo: CreatorInfo;
}

const TokenList: React.FC = () => {
  const { tokens, isLoading, isError } = useTokenFactory();

  if (isLoading) return <div>Loading tokens...</div>;
  if (isError) return <div>Error fetching tokens.</div>;

  // Type assertion with processed data
  const tokenInfos: TokenInfo[] = tokens as TokenInfo[];

  return (
    <div className="token-list">
      <h2>All Tokens</h2>
      {tokenInfos.length === 0 ? (
        <p>No tokens available.</p>
      ) : (
        tokenInfos.map((token, index) => (
          <div key={index} className="token-card">
            <h3>{token.basicInfo.name} ({token.basicInfo.symbol})</h3>
            <p><strong>Description:</strong> {token.basicInfo.description}</p>
            <p><strong>Creator:</strong> {token.basicInfo.creator}</p>
            <p><strong>Created At:</strong> {new Date(token.basicInfo.createdAt * 1000).toLocaleString()}</p>
            <h4>Creator Info:</h4>
            <p><strong>Twitch Username:</strong> {token.creatorInfo.twitchUsername}</p>
            <p><strong>Social Links:</strong> {token.creatorInfo.socialLinks.join(', ')}</p>
            <p><strong>Category:</strong> {token.creatorInfo.category}</p>
            <img src={token.creatorInfo.profileImageUrl} alt={`${token.creatorInfo.twitchUsername} Profile`} width={100} />
          </div>
        ))
      )}
    </div>
  );
};

export default TokenList;