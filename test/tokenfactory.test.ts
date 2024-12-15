import { expect } from "chai";
import { ethers } from "hardhat";
import { TokenFactory, BondedToken } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("TokenFactory", function () {
    let tokenFactory: TokenFactory;
    let owner: SignerWithAddress;
    let user: SignerWithAddress;

    beforeEach(async function () {
        [owner, user] = await ethers.getSigners();
        
        const TokenFactory = await ethers.getContractFactory("TokenFactory");
        tokenFactory = await TokenFactory.deploy();
        await tokenFactory.waitForDeployment();
    });

    describe("Token Creation", function () {
        it("Should create tokens with different curve types", async function () {
            const basicInfo = {
                name: "Linear Token",
                symbol: "LIN",
                description: "A token with linear bonding curve",
                curveType: 0, // LINEAR
                tokenAddress: ethers.ZeroAddress,
                curveAddress: ethers.ZeroAddress,
                paymentToken: ethers.ZeroAddress, // Use native token
                createdAt: 0,
                creator: ethers.ZeroAddress
            };

            const creatorInfo = {
                twitchUsername: "teststreamer",
                socialLinks: ["https://twitter.com/test"],
                profileImageUrl: "https://example.com/image.jpg",
                category: "Gaming"
            };

            const tx = await tokenFactory.createToken(
                basicInfo,
                creatorInfo,
                ethers.parseEther("0.000000001"), // param1 (slope)
                0 // param2 (unused)
            );

            await tx.wait();
            const tokens = await tokenFactory.getAllTokens();
            expect(tokens.length).to.equal(1);
            expect(tokens[0].name).to.equal("Linear Token");
        });

        it("Should track tokens by creator", async function () {
            const basicInfo = {
                name: "User Token",
                symbol: "USR",
                description: "A user created token",
                curveType: 0, // LINEAR
                tokenAddress: ethers.ZeroAddress,
                curveAddress: ethers.ZeroAddress,
                paymentToken: ethers.ZeroAddress,
                createdAt: 0,
                creator: ethers.ZeroAddress
            };

            const creatorInfo = {
                twitchUsername: "userstreamer",
                socialLinks: ["https://twitter.com/user"],
                profileImageUrl: "https://example.com/user.jpg",
                category: "Art"
            };

            await tokenFactory.createToken(basicInfo, creatorInfo, ethers.parseEther("0.000000001"), 0);
            
            const creatorTokens = await tokenFactory.getTokensByCreator(owner.address);
            expect(creatorTokens.length).to.equal(1);
            expect(creatorTokens[0].name).to.equal("User Token");
        });
    });
});