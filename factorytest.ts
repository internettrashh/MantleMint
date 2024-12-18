import { ethers } from "hardhat";
import { Contract } from "ethers";
import TokenFactoryArtifact from "./artifacts/contracts/core/TokenFactory.sol/TokenFactory.json";

async function main() {
    const FACTORY_ADDRESS = "0x1d81c3Bff1f89E6a0c0D97f453870399E3B1c25C";
    
    console.log("Querying TokenFactory at:", FACTORY_ADDRESS);

    try {
        // First verify if the address has code
        const code = await ethers.provider.getCode(FACTORY_ADDRESS);
        if (code === "0x") {
            throw new Error("No contract found at specified address");
        }

        console.log("Contract code found at address");

        // Get contract instance using ABI from artifacts
        const tokenFactory = new Contract(
            FACTORY_ADDRESS,
            TokenFactoryArtifact.abi,
            await ethers.provider.getSigner()
        );

        console.log("Contract instance created");

        // Verify contract interface
        try {
            const totalTokens = await tokenFactory.getTokenCount();
            console.log("\n=== Total Tokens ===");
            console.log(`Number of tokens created: ${totalTokens.toString()}`);
        } catch (error: any) {
            console.error("Error calling getTokenCount:", error.message);
            console.error("ABI Functions available:", TokenFactoryArtifact.abi
                .filter((item: any) => item.type === "function")
                .map((item: any) => item.name)
            );
            throw error;
        }

        // Get all tokens
        try {
            const allTokens = await tokenFactory.getAllTokens();
            console.log("\n=== All Tokens Basic Info ===");
            if (allTokens.length === 0) {
                console.log("No tokens found");
            } else {
                allTokens.forEach((token: any, index: number) => {
                    console.log(`\nToken ${index + 1}:`);
                    console.log(`Name: ${token.name}`);
                    console.log(`Symbol: ${token.symbol}`);
                    console.log(`Token Address: ${token.tokenAddress}`);
                    console.log(`Creator: ${token.creator}`);
                    console.log(`Created At: ${new Date(Number(token.createdAt) * 1000).toLocaleString()}`);
                    console.log(`Curve Type: ${getCurveTypeName(token.curveType)}`);
                });
            }
        } catch (error: any) {
            console.error("Error getting all tokens:", error.message);
        }

        // Get all tokens with info
        try {
            const tokensWithInfo = await tokenFactory.getAllTokensWithInfo();
            console.log("\n=== All Tokens With Creator Info ===");
            if (tokensWithInfo.length === 0) {
                console.log("No tokens with info found");
            } else {
                tokensWithInfo.forEach((tokenInfo: any, index: number) => {
                    console.log(`\nToken ${index + 1}:`);
                    console.log("Basic Info:");
                    console.log(`- Name: ${tokenInfo.basicInfo.name}`);
                    console.log(`- Symbol: ${tokenInfo.basicInfo.symbol}`);
                    console.log(`- Token Address: ${tokenInfo.basicInfo.tokenAddress}`);
                    
                    console.log("Creator Info:");
                    console.log(`- Twitch Username: ${tokenInfo.creatorInfo.twitchUsername}`);
                    console.log(`- Category: ${tokenInfo.creatorInfo.category}`);
                    console.log(`- Profile Image: ${tokenInfo.creatorInfo.profileImageUrl}`);
                    console.log("- Social Links:", tokenInfo.creatorInfo.socialLinks);
                });
            }
        } catch (error: any) {
            console.error("Error getting tokens with info:", error.message);
        }

    } catch (error: any) {
        console.error("Error querying contract:", error.message);
        
        // Additional debugging information
        if (error.code === 'BAD_DATA') {
            console.error("\nPossible causes:");
            console.error("1. Contract address might be incorrect");
            console.error("2. Contract might not be deployed on this network");
            console.error("3. ABI might not match the deployed contract");
            
            // Print available functions from ABI
            console.log("\nAvailable functions in ABI:");
            TokenFactoryArtifact.abi
                .filter((item: any) => item.type === "function")
                .forEach((item: any) => {
                    console.log(`- ${item.name}`);
                });
        }
        
        process.exit(1);
    }
}

function getCurveTypeName(curveType: number): string {
    const curveTypes = ['LINEAR', 'EXPONENTIAL', 'LOGARITHMIC', 'SIGMOID'];
    return curveTypes[curveType] || 'UNKNOWN';
}

// Add network configuration check
async function verifyNetwork() {
    const network = await ethers.provider.getNetwork();
    console.log(`Connected to network: ${network.name} (chainId: ${network.chainId})`);
    
    // Get signer info
    const signer = await ethers.provider.getSigner();
    const address = await signer.getAddress();
    const balance = await ethers.provider.getBalance(address);
    
    console.log("Signer address:", address);
    console.log("Signer balance:", ethers.formatEther(balance), "ETH");
    
    // Verify if we're on Mantle Sepolia
    if (network.chainId !== 5001) {
        console.warn("\nWarning: Not connected to Mantle Sepolia network!");
        console.warn("Make sure you're using the correct network configuration.");
    }
}

// Execute
verifyNetwork()
    .then(() => main())
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });