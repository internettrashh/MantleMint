// frontend/src/types/token.ts
export interface CreatorInfo {
  address: string;
  twitchUsername: string;
  socialLinks: string[];
  profileImageUrl: string;
  category: string;
}

export interface BasicTokenInfo {
  tokenAddress: string;
  name: string;
  symbol: string;
  description: string;
  curveType: string; // Assuming it's an enum represented as a string after conversion
  curveAddress: string;
  paymentToken: string;
  createdAt: number; // UNIX timestamp as a number
  creator: string;
}

export interface TokenInfo extends BasicTokenInfo {
  twitchUsername: string;
  socialLinks: string[];
  profileImageUrl: string;
  category: string;
  price: number; // Added for price information
  change: number; // Added for 24hr change
  imageUrl: string; // Added for token image
}

export interface WalletBalance {
  tokenBalance: number;
  mntBalance: number;
}