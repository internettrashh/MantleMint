// src/hooks/useAllTokens.ts
import { useContractRead } from 'wagmi';
import TokenFactoryABI from '../contractsabi/core/TokenFactory.sol/TokenFactory.json';
import { TokenInfo } from '../types/token';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

const TOKEN_FACTORY_ADDRESS = '0xb376F7737C323a817D29ee3162C64fe8a1ef9A81';

// Add enum definition for curve types
enum CurveType {
  LINEAR = 0,
  EXPONENTIAL = 1,
  LOGARITHMIC = 2,
  SIGMOID = 3
}

/**
 * Custom hook to fetch all tokens with their creator information.
 */
export function useAllTokens() {
  const { data, isLoading, isError, error } = useContractRead({
    address: TOKEN_FACTORY_ADDRESS,
    abi: TokenFactoryABI.abi,
    functionName: 'getAllTokensWithInfo',
    onError: (err) => {
      console.error('Contract read error:', err);
      // Log available functions in ABI for debugging
      console.log('Available functions:', 
        TokenFactoryABI.abi
          .filter((item: any) => item.type === "function")
          .map((item: any) => item.name)
      );
    }
  });

  const [combinedData, setCombinedData] = useState<TokenInfo[] | undefined>(undefined);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      console.log('Raw Data from getAllTokensWithInfo:', data);

      try {
        const tokensWithInfo: TokenInfo[] = data.map((token: any, index: number) => {
          // Enhanced validation
          if (!token) {
            throw new Error(`Token at index ${index} is undefined`);
          }
          if (!token.basicInfo) {
            throw new Error(`Token at index ${index} is missing basicInfo`);
          }
          if (!token.creatorInfo) {
            throw new Error(`Token at index ${index} is missing creatorInfo`);
          }

          // Validate required fields, but remove curveType from this check
          const requiredBasicFields = ['tokenAddress', 'name', 'symbol', 'description', 'curveAddress', 'creator'];
          requiredBasicFields.forEach(field => {
            if (!token.basicInfo[field]) {
              throw new Error(`Token at index ${index} is missing required basic field: ${field}`);
            }
          });

          // Separate validation for curveType as a number
          if (typeof token.basicInfo.curveType !== 'number') {
            throw new Error(`Token at index ${index} has invalid curveType: ${token.basicInfo.curveType}`);
          }

          const requiredCreatorFields = ['twitchUsername', 'socialLinks', 'profileImageUrl', 'category'];
          requiredCreatorFields.forEach(field => {
            if (!token.creatorInfo[field]) {
              throw new Error(`Token at index ${index} is missing required creator field: ${field}`);
            }
          });

          // Handle createdAt conversion
          let createdAt: number;
          const rawCreatedAt = token.basicInfo.createdAt;
          
          if (typeof rawCreatedAt === 'bigint') {
            createdAt = Number(rawCreatedAt);
          } else if (ethers.BigNumber.isBigNumber(rawCreatedAt)) {
            createdAt = rawCreatedAt.toNumber();
          } else if (typeof rawCreatedAt === 'string') {
            createdAt = parseInt(rawCreatedAt, 10);
          } else if (typeof rawCreatedAt === 'number') {
            createdAt = rawCreatedAt;
          } else {
            console.warn(`Token ${index}: Unexpected type for createdAt:`, typeof rawCreatedAt);
            createdAt = 0;
          }

          return {
            basicInfo: {
              tokenAddress: token.basicInfo.tokenAddress,
              name: token.basicInfo.name,
              symbol: token.basicInfo.symbol,
              description: token.basicInfo.description,
              curveType: CurveType[token.basicInfo.curveType] || 'UNKNOWN', // Convert number to string enum
              curveAddress: token.basicInfo.curveAddress,
              paymentToken: token.basicInfo.paymentToken ,
              createdAt: createdAt,
              creator: token.basicInfo.creator,
              imageUrl: token.basicInfo.imageUrl || '',
            },
            creatorInfo: {
              twitchUsername: token.creatorInfo.twitchUsername,
              socialLinks: Array.isArray(token.creatorInfo.socialLinks) 
                ? token.creatorInfo.socialLinks 
                : [],
              profileImageUrl: token.creatorInfo.profileImageUrl,
              category: token.creatorInfo.category,
            },
          };
        });

        console.log('Processed tokens:', tokensWithInfo);
        setCombinedData(tokensWithInfo);
      } catch (err: any) {
        console.error('Error processing token data:', err);
        setLocalError(err.message || 'Failed to process token data.');
      }
    }
  }, [data]);

  // Enhanced error handling
  const isCombinedLoading = isLoading;
  const isCombinedError = isError || !!localError || !!error?.message;
  const errorMessage = localError || error?.message || '';

  return { 
    data: combinedData, 
    isLoading: isCombinedLoading, 
    isError: isCombinedError, 
    error: errorMessage,
    rawData: data // Expose raw data for debugging
  };
}