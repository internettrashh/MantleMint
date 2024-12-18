import { expect } from "chai";
import { ethers } from "hardhat";
import { TokenFactory } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("TokenFactory", function () {
    let tokenFactory: TokenFactory;
    let owner: SignerWithAddress;
    
    const testStreamers = [
        {
            name: "TestStreamer1",
            ticker: "TEST1",
            url: "https://twitch.tv/teststreamer1",
            profile_pic: "https://example.com/pic1.jpg",
            category: "Gaming",
            bonding_curve_type: "LINEAR"
        },
        {
            name: "TestStreamer2",
            ticker: "TEST2",
            url: "https://twitch.tv/teststreamer2",
            profile_pic: "https://example.com/pic2.jpg",
            category: "Just Chatting",
            bonding_curve_type: "EXPONENTIAL"
        },
        {
            name: "TestStreamer3",
            ticker: "TEST3",
            url: "https://twitch.tv/teststreamer3",
            profile_pic: "https://example.com/pic3.jpg",
            category: "Music",
            bonding_curve_type: "LOGARITHMIC"
        },
        {
            name: "TestStreamer4",
            ticker: "TEST4",
            url: "https://twitch.tv/teststreamer4",
            profile_pic: "https://example.com/pic4.jpg",
            category: "Art",
            bonding_curve_type: "SIGMOID"
        }
    ];

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

    beforeEach(async function () {
        [owner] = await ethers.getSigners();
        
        const TokenFactory = await ethers.getContractFactory("TokenFactory");
        tokenFactory = await TokenFactory.deploy();
        await tokenFactory.waitForDeployment();
        
        // Create tokens for test streamers
        for (const streamer of testStreamers) {
            const basicInfo = {
                tokenAddress: ethers.ZeroAddress,
                name: `${streamer.name} Fan Token`,
                symbol: streamer.ticker,
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
            
            await tokenFactory.createToken(
                basicInfo,
                creatorInfo,
                ethers.parseEther(params.param1),
                ethers.parseEther(params.param2)
            );
        }
    });

    describe("Token Creation", function () {
        it("should create tokens with correct curve types", async function () {
            const tokensWithInfo = await tokenFactory.getAllTokensWithInfo();
            
            tokensWithInfo.forEach((tokenInfo, index) => {
                expect(tokenInfo.basicInfo.curveType).to.equal(
                    CURVE_TYPE_MAP[testStreamers[index].bonding_curve_type],
                    `Token ${index + 1} has incorrect curve type`
                );
            });
        });

        it("should set correct creator address", async function () {
            const tokensWithInfo = await tokenFactory.getAllTokensWithInfo();
            
            tokensWithInfo.forEach((tokenInfo) => {
                expect(tokenInfo.basicInfo.creator).to.equal(owner.address);
            });
        });
    });

    describe("getAllTokens", function () {
        it("should return all created tokens with correct information", async function () {
            const tokens = await tokenFactory.getAllTokens();
            
            expect(tokens.length).to.equal(testStreamers.length);
            
            tokens.forEach((token, index) => {
                const streamer = testStreamers[index];
                expect(token.name).to.equal(`${streamer.name} Fan Token`);
                expect(token.symbol).to.equal(streamer.ticker);
                expect(token.description).to.include(streamer.category);
                expect(token.tokenAddress).to.not.equal(ethers.ZeroAddress);
                expect(token.creator).to.equal(owner.address);
                expect(token.curveAddress).to.not.equal(ethers.ZeroAddress);
            });
        });
    });

    describe("getAllTokensWithInfo", function () {
        it("should return all tokens with their streamer information", async function () {
            const tokensWithInfo = await tokenFactory.getAllTokensWithInfo();
            
            expect(tokensWithInfo.length).to.equal(testStreamers.length);
            
            for (let i = 0; i < tokensWithInfo.length; i++) {
                const tokenInfo = tokensWithInfo[i];
                const streamer = testStreamers[i];
                
                // Check basic token info
                expect(tokenInfo.basicInfo.name, `Token ${i + 1} name mismatch`)
                    .to.equal(`${streamer.name} Fan Token`);
                expect(tokenInfo.basicInfo.symbol, `Token ${i + 1} symbol mismatch`)
                    .to.equal(streamer.ticker);
                expect(tokenInfo.basicInfo.tokenAddress, `Token ${i + 1} has invalid token address`)
                    .to.not.equal(ethers.ZeroAddress);
                expect(tokenInfo.basicInfo.curveAddress, `Token ${i + 1} has invalid curve address`)
                    .to.not.equal(ethers.ZeroAddress);
                
                // Check creator info
                expect(tokenInfo.creatorInfo.twitchUsername, `Token ${i + 1} username mismatch`)
                    .to.equal(streamer.url.split('/').pop());
                expect(tokenInfo.creatorInfo.profileImageUrl, `Token ${i + 1} profile pic mismatch`)
                    .to.equal(streamer.profile_pic);
                expect(tokenInfo.creatorInfo.category, `Token ${i + 1} category mismatch`)
                    .to.equal(streamer.category);
                expect(tokenInfo.creatorInfo.socialLinks[0], `Token ${i + 1} social link mismatch`)
                    .to.equal(streamer.url);
            }
        });

        it("should maintain correct association between tokens and their creators", async function () {
            const tokensWithInfo = await tokenFactory.getAllTokensWithInfo();
            
            tokensWithInfo.forEach((tokenInfo, index) => {
                const streamer = testStreamers[index];
                expect(tokenInfo.creatorInfo.twitchUsername, `Token ${index + 1} username mismatch`)
                    .to.equal(streamer.url.split('/').pop());
                expect(tokenInfo.creatorInfo.category, `Token ${index + 1} category mismatch`)
                    .to.equal(streamer.category);
                expect(tokenInfo.basicInfo.creator, `Token ${index + 1} creator address mismatch`)
                    .to.equal(owner.address);
            });
        });
    });

    describe("Token counts", function () {
        it("should return correct total token count", async function () {
            const count = await tokenFactory.getTokenCount();
            expect(count).to.equal(testStreamers.length);
        });

        it("should return correct creator token count", async function () {
            const count = await tokenFactory.getCreatorTokenCount(owner.address);
            expect(count).to.equal(testStreamers.length);
        });

        it("should return zero for addresses with no tokens", async function () {
            const [_, randomAddress] = await ethers.getSigners();
            const count = await tokenFactory.getCreatorTokenCount(randomAddress.address);
            expect(count).to.equal(0);
        });
    });
});