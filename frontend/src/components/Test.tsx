import React from 'react';
import { useAllTokens } from '../hooks/getAlltokens';

interface BasicTokenInfo {
  tokenAddress: string;
  name: string;
  symbol: string;
  description: string;
  curveType: string;
  curveAddress: string;
  paymentToken: string;
  createdAt: number;
  creator: string;
  imageUrl?: string;
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

const bigIntSerializer = (key: string, value: any) => {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
};

const TokenList: React.FC = () => {
  const { data: tokens, isLoading, isError, error, rawData } = useAllTokens();

  if (isLoading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading tokens...</p>
    </div>
  );

  if (isError) return (
    <div className="error-container">
      <h3>Error fetching tokens</h3>
      <p>{error}</p>
      <details>
        <summary>Debug Information</summary>
        <pre>
          {JSON.stringify(rawData, bigIntSerializer, 2)}
        </pre>
      </details>
    </div>
  );

  return (
    <div className="token-list-container">
      <h2>Fan Tokens Overview</h2>
      <div className="token-stats">
        <p>Total Tokens: {tokens?.length || 0}</p>
      </div>
      
      {(!tokens || tokens.length === 0) ? (
        <div className="no-tokens">
          <p>No tokens available.</p>
        </div>
      ) : (
        <div className="token-grid">
          {tokens.map((token, index) => (
            <div key={token.basicInfo.tokenAddress || index} className="token-card">
              <div className="token-header">
                <img 
                  src={token.creatorInfo.profileImageUrl} 
                  alt={`${token.creatorInfo.twitchUsername} Profile`} 
                  className="creator-image"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/default-profile.png';
                  }}
                />
                <div className="token-title">
                  <h3>{token.basicInfo.name}</h3>
                  <span className="token-symbol">{token.basicInfo.symbol}</span>
                </div>
              </div>

              <div className="token-content">
                <div className="token-section">
                  <h4>Token Details</h4>
                  <p><strong>Description:</strong> {token.basicInfo.description}</p>
                  <p><strong>Token Address:</strong> 
                    <a 
                      href={`https://explorer.testnet.mantle.xyz/address/${token.basicInfo.tokenAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {token.basicInfo.tokenAddress.slice(0, 6)}...{token.basicInfo.tokenAddress.slice(-4)}
                    </a>
                  </p>
                  <p><strong>Curve Type:</strong> {token.basicInfo.curveType}</p>
                  <p><strong>Created:</strong> {new Date(token.basicInfo.createdAt * 1000).toLocaleString()}</p>
                </div>

                <div className="token-section">
                  <h4>Creator Information</h4>
                  <p><strong>Creator:</strong> 
                    <a 
                      href={`https://explorer.testnet.mantle.xyz/address/${token.basicInfo.creator}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {token.basicInfo.creator.slice(0, 6)}...{token.basicInfo.creator.slice(-4)}
                    </a>
                  </p>
                  <p><strong>Twitch:</strong> 
                    <a 
                      href={`https://twitch.tv/${token.creatorInfo.twitchUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {token.creatorInfo.twitchUsername}
                    </a>
                  </p>
                  <p><strong>Category:</strong> {token.creatorInfo.category}</p>
                  <div className="social-links">
                    <strong>Social Links:</strong>
                    <ul>
                      {token.creatorInfo.socialLinks.map((link, i) => (
                        <li key={i}>
                          <a href={link} target="_blank" rel="noopener noreferrer">
                            {new URL(link).hostname}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="token-section">
                  <h4>Technical Details</h4>
                  <p><strong>Curve Address:</strong> 
                    <a 
                      href={`https://explorer.testnet.mantle.xyz/address/${token.basicInfo.curveAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {token.basicInfo.curveAddress.slice(0, 6)}...{token.basicInfo.curveAddress.slice(-4)}
                    </a>
                  </p>
                  <p><strong>Payment Token:</strong> 
                    <a 
                      href={`https://explorer.testnet.mantle.xyz/address/${token.basicInfo.paymentToken}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {token.basicInfo.paymentToken.slice(0, 6)}...{token.basicInfo.paymentToken.slice(-4)}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TokenList;