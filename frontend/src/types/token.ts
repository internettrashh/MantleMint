// frontend/src/types/token.ts
export interface CreatorInfo {
  twitchUsername: string;
  socialLinks: string[];
  profileImageUrl: string;
  category: string;
}

export interface BasicTokenInfo {
  name: string;
  symbol: string;
  address: string;
  description?: string;
  curveType?: number;
  curveAddress?: string;
  paymentToken?: string;
  createdAt?: number;
  creator?: string;
}

export interface MarketData {
  currentPrice: number;
  totalSupply: number;
}

export interface TokenData {
  basicInfo: BasicTokenInfo;
  creatorInfo: CreatorInfo;
  marketData?: MarketData;
}

export interface WalletBalance {
  tokenBalance: number;
  mntBalance: number;
}