export interface TokenInfo {
  creatorName: string;
  tokenTicker: string;
  twitchUrl: string;
  profileUrl: string;
  category: string;
  curveType: 'linear' | 'exponential' | 'logarithmic' | 'sigmoid';
  currentPrice: number;
  totalSupply: number;
}

export interface WalletBalance {
  tokenBalance: number;
  mntBalance: number;
}