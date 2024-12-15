import { ethers } from "hardhat";
import * as hre from "hardhat";

// Custom sleep function
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const TIMEOUT = 60000; // 60 seconds

async function deployWithRetry(contractName: string, factory: any, args: any[] = [], retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            console.log(`Deploying ${contractName}... (Attempt ${i + 1}/${retries})`);
            const contract = await factory.deploy(...args);
            await contract.waitForDeployment();
            console.log(`${contractName} deployed to:`, await contract.getAddress());
            return contract;
        } catch (error: any) {
            if (i === retries - 1) throw error; // Last attempt failed
            console.log(`Deployment attempt failed, retrying in 5 seconds...`);
            await sleep(5000); // Wait 5 seconds before retrying
        }
    }
}

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

    try {
        // Deploy TokenFactory with retry logic
        const TokenFactory = await ethers.getContractFactory("TokenFactory");
        const tokenFactory = await deployWithRetry("TokenFactory", TokenFactory);

        const tokenFactoryAddress = await tokenFactory.getAddress();

        // Wait for more confirmations with timeout handling
        console.log("Waiting for confirmations...");
        try {
            await Promise.race([
                tokenFactory.deploymentTransaction()?.wait(6),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error("Confirmation timeout")), TIMEOUT)
                )
            ]);
        } catch (error: any) {
            console.log("Warning: Confirmation wait timed out, continuing...");
        }

        // Verify contract
        if (process.env.ETHERSCAN_API_KEY) {
            console.log("Verifying contract on Etherscan...");
            try {
                await hre.run("verify:verify", {
                    address: tokenFactoryAddress,
                    constructorArguments: []
                });
                console.log("Contract verified successfully");
            } catch (error: any) {
                if (error.message.toLowerCase().includes("already verified")) {
                    console.log("Contract already verified");
                } else {
                    console.error("Verification error:", error);
                }
            }
        }

        // Create a sample token
        console.log("Creating sample token...");
        const tx = await tokenFactory.createToken(
            "Sample Token",
            "SMPL",
            "A sample token with linear bonding curve",
            0, // LINEAR curve
            ethers.parseEther("0.000000001"),  // slope
            0 // unused parameter
        );

        await tx.wait();
        console.log("Sample token created!");

        // Get the created token info
        const allTokens = await tokenFactory.getAllTokens();
        console.log("Sample token address:", allTokens[0].tokenAddress);

    } catch (error) {
        console.error("Deployment failed:", error);
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });