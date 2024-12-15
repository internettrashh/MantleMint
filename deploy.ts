import { ethers } from "hardhat";
import * as hre from "hardhat";

const STREAMERS = {
    "streamers": [
        {
            "name": "Ninja",
            "ticker": "NINJA",
            "url": "https://www.twitch.tv/ninja",
            "profile_pic": "https://static.vecteezy.com/system/resources/previews/012/660/861/non_2x/twitch-logo-on-transparent-isolated-background-free-vector.jpg",
            "category": "Gaming",
            "bonding_curve_type": "LINEAR"
        },
        {
            "name": "Pokimane",
            "ticker": "POKI",
            "url": "https://www.twitch.tv/pokimane",
            "profile_pic": "https://static.vecteezy.com/system/resources/previews/012/660/861/non_2x/twitch-logo-on-transparent-isolated-background-free-vector.jpg",
            "category": "Just Chatting",
            "bonding_curve_type": "EXPONENTIAL"
        },
        {
            "name": "Shroud",
            "url": "https://www.twitch.tv/shroud",
            "profile_pic": "https://static.vecteezy.com/system/resources/previews/012/660/861/non_2x/twitch-logo-on-transparent-isolated-background-free-vector.jpg",
            "category": "Gaming",
            "bonding_curve_type": "LOGARITHMIC"
        },
        {
            "name": "xQcOW",
            "url": "https://www.twitch.tv/xqcow",
            "profile_pic": "https://static.vecteezy.com/system/resources/previews/012/660/861/non_2x/twitch-logo-on-transparent-isolated-background-free-vector.jpg",
            "category": "Just Chatting",
            "bonding_curve_type": "SIGMOID"
        },
        {
            "name": "Tfue",
            "url": "https://www.twitch.tv/tfue",
            "profile_pic": "https://static.vecteezy.com/system/resources/previews/012/660/861/non_2x/twitch-logo-on-transparent-isolated-background-free-vector.jpg",
            "category": "Gaming",
            "bonding_curve_type": "LINEAR"
        },
        {
            "name": "Summit1G",
            "url": "https://www.twitch.tv/summit1g",
            "profile_pic": "https://static.vecteezy.com/system/resources/previews/012/660/861/non_2x/twitch-logo-on-transparent-isolated-background-free-vector.jpg",
            "category": "Gaming",
            "bonding_curve_type": "EXPONENTIAL"
        },
        {
            "name": "DrLupo",
            "url": "https://www.twitch.tv/drlupo",
            "profile_pic": "https://static.vecteezy.com/system/resources/previews/012/660/861/non_2x/twitch-logo-on-transparent-isolated-background-free-vector.jpg",
            "category": "Gaming",
            "bonding_curve_type": "LOGARITHMIC"
        },
        {
            "name": "Sodapoppin",
            "url": "https://www.twitch.tv/sodapoppin",
            "profile_pic": "https://static.vecteezy.com/system/resources/previews/012/660/861/non_2x/twitch-logo-on-transparent-isolated-background-free-vector.jpg", 
            "category": "Just Chatting",    
            "bonding_curve_type": "SIGMOID"
        },
        {
            "name": "Asmongold",
            "url": "https://www.twitch.tv/asmongold",
            "profile_pic": "https://static.vecteezy.com/system/resources/previews/012/660/861/non_2x/twitch-logo-on-transparent-isolated-background-free-vector.jpg",
            "category": "Gaming",
            "bonding_curve_type": "LINEAR"
        },      
        {
            "name":"Ludwig",
            "url":"https://www.twitch.tv/ludwig",
            "profile_pic":"https://static.vecteezy.com/system/resources/previews/012/660/861/non_2x/twitch-logo-on-transparent-isolated-background-free-vector.jpg", 
            "category":"Just Chatting",
            "bonding_curve_type":"EXPONENTIAL"
        }
    ]
};

const CURVE_TYPE_MAP: { [key: string]: number } = {
    "LINEAR": 0,
    "EXPONENTIAL": 1,
    "LOGARITHMIC": 2,
    "SIGMOID": 3
};

const CURVE_PARAMS: { [key: string]: { param1: string, param2: string } } = {
    "LINEAR": { param1: "0.000000001", param2: "0" },
    "EXPONENTIAL": { param1: "1.5", param2: "0" },
    "LOGARITHMIC": { param1: "2", param2: "0" },
    "SIGMOID": { param1: "0.5", param2: "1000" }
};

async function deployWithRetry(contractName: string, factory: any, args: any[] = [], retries = 5) {
    for (let i = 0; i < retries; i++) {
        try {
            console.log(`Deploying ${contractName}... (Attempt ${i + 1}/${retries})`);
            const contract = await factory.deploy(...args);
            await contract.waitForDeployment();
            console.log(`${contractName} deployed to:`, await contract.getAddress());
            return contract;
        } catch (error: any) {
            if (i === retries - 1) throw error;
            console.log(`Deployment attempt failed, retrying in 10 seconds...`);
            await new Promise(resolve => setTimeout(resolve, 10000));
        }
    }
}

async function createTokenForStreamer(tokenFactory: any, streamer: any) {
    try {
        console.log(`\nCreating token for ${streamer.name}...`);
        
        const basicInfo = {
            tokenAddress: ethers.ZeroAddress,
            name: `${streamer.name} Fan Token`,
            symbol: streamer.name.substring(0, 4).toUpperCase(),
            description: `Official fan token for ${streamer.name} - ${streamer.category} streamer`,
            curveType: CURVE_TYPE_MAP[streamer.bonding_curve_type],
            curveAddress: ethers.ZeroAddress,
            paymentToken: ethers.ZeroAddress,
            createdAt: 0,
            creator: ethers.ZeroAddress
        };

        const creatorInfo = {
            twitchUsername: streamer.url.split('/').pop() || "",
            socialLinks: [streamer.url],
            profileImageUrl: streamer.profile_pic,
            category: streamer.category
        };

        const params = CURVE_PARAMS[streamer.bonding_curve_type];
        
        // Wait for transaction to be mined
        const tx = await tokenFactory.createToken(
            basicInfo,
            creatorInfo,
            ethers.parseEther(params.param1),
            ethers.parseEther(params.param2)
        );
        
        const receipt = await tx.wait(2);
        
        // Get token address from event logs
        const event = receipt.logs.find((log: any) => 
            log.fragment?.name === 'TokenCreated'
        );

        if (event) {
            console.log(`✅ Token created for ${streamer.name}`);
            console.log(`Token address: ${event.args.tokenAddress}`);
            console.log(`Curve type: ${streamer.bonding_curve_type}`);
        }

        // Add delay between deployments
        await new Promise(resolve => setTimeout(resolve, 5000));

    } catch (error) {
        console.error(`❌ Failed to create token for ${streamer.name}:`, error);
    }
}

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying to Mantle Sepolia...");
    console.log("Deployer address:", deployer.address);
    console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

    try {
        // Deploy TokenFactory
        const TokenFactory = await ethers.getContractFactory("TokenFactory");
        const tokenFactory = await deployWithRetry("TokenFactory", TokenFactory);
        const tokenFactoryAddress = await tokenFactory.getAddress();

        // Wait for deployment confirmation
        console.log("\nWaiting for confirmations...");
        try {
            const receipt = await tokenFactory.deploymentTransaction()?.wait(3);
            console.log("Deployment confirmed in block:", receipt.blockNumber);
        } catch (error) {
            console.log("Warning: Confirmation wait timed out, continuing...");
        }

        // Verify contract
        if (process.env.MANTLE_EXPLORER_API_KEY) {
            console.log("\nVerifying contract on Mantle Explorer...");
            try {
                await hre.run("verify:verify", {
                    address: tokenFactoryAddress,
                    constructorArguments: [],
                    network: "mantleSepolia"
                });
                console.log("✅ Contract verified successfully");
            } catch (error) {
                console.error("❌ Verification error:", error);
            }
        }

        // Create tokens for all streamers
        console.log("\n📦 Creating tokens for streamers...");
        for (let i = 0; i < STREAMERS.streamers.length; i++) {
            await createTokenForStreamer(tokenFactory, STREAMERS.streamers[i]);
        }

        // Print summary
        console.log("\n🎉 Deployment Summary:");
        const allTokens = await tokenFactory.getAllTokens();
        console.log(`Total tokens created: ${allTokens.length}`);
        allTokens.forEach((token: any, index: number) => {
            console.log(`${index + 1}. ${token.name}`);
            console.log(`   Address: ${token.tokenAddress}`);
            console.log(`   Curve Type: ${Object.keys(CURVE_TYPE_MAP)[token.curveType]}`);
        });

    } catch (error) {
        console.error("\n❌ Deployment failed:", error);
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });