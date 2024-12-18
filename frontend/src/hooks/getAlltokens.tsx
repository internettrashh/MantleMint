// src/hooks/useAllTokens.ts
import { useContractRead } from 'wagmi';
import TokenFactoryABI from '../contractsabi/core/TokenFactory.sol/TokenFactory.json';
import { TokenInfo } from '../types/token';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

const TOKEN_FACTORY_ADDRESS = '0xA9A21a72f68f621ea6B1a3C7AcBa48f8718d1E76';

/**
 * Custom hook to fetch all tokens with their creator information.
 */
export function useAllTokens() {
  const { data, isLoading, isError, error } = useContractRead({
    address: TOKEN_FACTORY_ADDRESS,
    abi: TokenFactoryABI.abi,
    functionName: 'getAllTokensWithInfo',
  });

  const [combinedData, setCombinedData] = useState<TokenInfo[] | undefined>(undefined);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      console.log('Raw Data from getAllTokensWithInfo:', data); // Debugging line

      try {
        const tokensWithInfo: TokenInfo[] = data.map((token: any) => {
          // Ensure token.basicInfo and token.creatorInfo exist
          if (!token || !token.basicInfo || !token.creatorInfo) {
            throw new Error('Token data is missing basicInfo or creatorInfo fields.');
          }

          let createdAt: number;
          if (ethers.BigNumber.isBigNumber(token.basicInfo.createdAt)) {
            createdAt = token.basicInfo.createdAt.toNumber();
          } else if (typeof token.basicInfo.createdAt === 'string') {
            createdAt = parseInt(token.basicInfo.createdAt, 10);
          } else if (typeof token.basicInfo.createdAt === 'number') {
            createdAt = token.basicInfo.createdAt;
          } else {
            console.warn('Unexpected type for createdAt:', typeof token.basicInfo.createdAt);
            createdAt = 0; // Default or handle accordingly
          }

          return {
            basicInfo: {
              tokenAddress: token.basicInfo.tokenAddress,
              name: token.basicInfo.name,
              symbol: token.basicInfo.symbol,
              description: token.basicInfo.description,
              curveType: token.basicInfo.curveType,
              curveAddress: token.basicInfo.curveAddress,
              paymentToken: token.basicInfo.paymentToken,
              createdAt: createdAt,
              creator: token.basicInfo.creator,
              // Include imageUrl if available
              imageUrl: token.basicInfo.imageUrl || '', // Adjust based on data structure
            },
            creatorInfo: {
              twitchUsername: token.creatorInfo.twitchUsername,
              socialLinks: token.creatorInfo.socialLinks,
              profileImageUrl: token.creatorInfo.profileImageUrl,
              category: token.creatorInfo.category,
            },
          };
        });
        setCombinedData(tokensWithInfo);
      } catch (err: any) {
        console.error('Error processing token data:', err);
        setLocalError('Failed to process token data.');
      }
    }
  }, [data]);

  // Consolidate loading and error states
  const isCombinedLoading = isLoading;
  const isCombinedError = isError || localError || error?.message;

  return { data: combinedData, isLoading: isCombinedLoading, isError: isCombinedError, error: isCombinedError };
}