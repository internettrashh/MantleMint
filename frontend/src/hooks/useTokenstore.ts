import { create } from 'zustand';
import { ethers, BrowserProvider } from 'ethers';
import TokenFactoryABI from '../contractsabi/core/TokenFactory.sol/TokenFactory.json';

export interface TokenInfo {
  creatorName: string;
  tokenTicker: string;
  twitchUrl: string;
  profileUrl: string;
  category: string;
  curveType: 'exponential' | 'linear' | 'logarithmic' | 'sigmoid';
  currentPrice: number;
  totalSupply: number;
}

const TOKEN_FACTORY_ADDRESS = '0xb376F7737C323a817D29ee3162C64fe8a1ef9A81';

interface TokenStore {
  tokens: TokenData[];
  isLoading: boolean;
  error: string | null;
  setTokens: (tokens: TokenData[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchTokens: () => Promise<void>;
  refreshTokens: () => Promise<void>;
  getTokenInfo: (tokenAddress: string) => Promise<TokenData | null>;
}

interface TokenData {
  basicInfo: {
    tokenAddress: string;
    name: string;
    symbol: string;
    description: string;
    curveType: number;
    curveAddress: string;
    paymentToken: string;
    createdAt: number;
    creator: string;
    imageUrl: string;
  };
  creatorInfo: {
    twitchUsername: string;
    socialLinks: string[];
    profileImageUrl: string;
    category: string;
  };
}

export const useTokenStore = create<TokenStore>((set, get) => ({
  tokens: [],
  isLoading: false,
  error: null,
  setTokens: (tokens) => set({ tokens }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  getTokenInfo: async (tokenAddress: string) => {
    try {
      set({ isLoading: true, error: null });

      // First check if we already have the token in our store
      const existingTokens = get().tokens;
      const existingToken = existingTokens.find(
        token => token.basicInfo.tokenAddress.toLowerCase() === tokenAddress.toLowerCase()
      );

      if (existingToken) {
        return existingToken;
      }

      if (!window.ethereum) {
        throw new Error('Please install MetaMask or another Web3 wallet');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        TOKEN_FACTORY_ADDRESS,
        TokenFactoryABI.abi,
        provider
      );

      // Get all tokens and find the one we want
      const allTokens = await contract.getAllTokensWithInfo();
      const targetToken = allTokens.find((token: any) => 
        token.basicInfo.tokenAddress.toLowerCase() === tokenAddress.toLowerCase()
      );

      if (!targetToken) {
        throw new Error('Token not found');
      }

      // Process the token data
      const processedToken = {
        basicInfo: {
          tokenAddress: targetToken.basicInfo.tokenAddress,
          name: targetToken.basicInfo.name,
          symbol: targetToken.basicInfo.symbol,
          description: targetToken.basicInfo.description,
          curveType: Number(targetToken.basicInfo.curveType),
          curveAddress: targetToken.basicInfo.curveAddress,
          paymentToken: targetToken.basicInfo.paymentToken,
          createdAt: Number(targetToken.basicInfo.createdAt),
          creator: targetToken.basicInfo.creator,
          imageUrl: targetToken.basicInfo.imageUrl || '',
        },
        creatorInfo: {
          twitchUsername: targetToken.creatorInfo.twitchUsername,
          socialLinks: targetToken.creatorInfo.socialLinks || [],
          profileImageUrl: targetToken.creatorInfo.profileImageUrl,
          category: targetToken.creatorInfo.category,
        },
      };

      // Update the store with the new token
      set(state => ({
        tokens: [...state.tokens, processedToken]
      }));

      return processedToken;
    } catch (error) {
      console.error('Error in getTokenInfo:', error);
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTokens: async () => {
    try {
      set({ isLoading: true, error: null });

      if (!window.ethereum) {
        throw new Error('Please install MetaMask or another Web3 wallet');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        TOKEN_FACTORY_ADDRESS,
        TokenFactoryABI.abi,
        provider
      );

      const rawTokens = await contract.getAllTokensWithInfo();
      
      const processedTokens = rawTokens.map((token: any) => ({
        basicInfo: {
          tokenAddress: token.basicInfo.tokenAddress,
          name: token.basicInfo.name,
          symbol: token.basicInfo.symbol,
          description: token.basicInfo.description,
          curveType: Number(token.basicInfo.curveType),
          curveAddress: token.basicInfo.curveAddress,
          paymentToken: token.basicInfo.paymentToken,
          createdAt: Number(token.basicInfo.createdAt),
          creator: token.basicInfo.creator,
          imageUrl: token.basicInfo.imageUrl || '',
        },
        creatorInfo: {
          twitchUsername: token.creatorInfo.twitchUsername,
          socialLinks: token.creatorInfo.socialLinks || [],
          profileImageUrl: token.creatorInfo.profileImageUrl,
          category: token.creatorInfo.category,
        },
      }));

      set({ tokens: processedTokens });
    } catch (error: any) {
      console.error('Error fetching tokens:', error);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  refreshTokens: async () => {
    const { fetchTokens } = get();
    await fetchTokens();
  },
}));