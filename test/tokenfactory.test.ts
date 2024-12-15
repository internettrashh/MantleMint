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
            // Create Linear Token
            const tx1 = await tokenFactory.createToken(
                "Linear Token",
                "LIN",
                "A token with linear bonding curve",
                0, // LINEAR
                ethers.parseEther("0.1"), // slope
                0 // unused
            );
            
            // Create Exponential Token
            const tx2 = await tokenFactory.createToken(
                "Exponential Token",
                "EXP",
                "A token with exponential bonding curve",
                1, // EXPONENTIAL
                2, // exponent
                0 // unused
            );

            // Verify tokens were created
            const allTokens = await tokenFactory.getAllTokens();
            expect(allTokens.length).to.equal(2);
            
            // Check first token details
            expect(allTokens[0].name).to.equal("Linear Token");
            expect(allTokens[0].symbol).to.equal("LIN");
            expect(allTokens[0].curveType).to.equal(0); // LINEAR

            // Verify token functionality
            const linearToken = await ethers.getContractAt("BondedToken", allTokens[0].tokenAddress);
            await linearToken.buy({ value: ethers.parseEther("1") });
            const balance = await linearToken.balanceOf(owner.address);
            expect(balance).to.be.gt(0);
        });

        it("Should track tokens by creator", async function () {
            await tokenFactory.connect(user).createToken(
                "User Token",
                "USR",
                "A user created token",
                0, // LINEAR
                ethers.parseEther("0.1"), // slope
                0 // unused
            );

            const userTokens = await tokenFactory.getTokensByCreator(user.address);
            expect(userTokens.length).to.equal(1);
            expect(userTokens[0].creator).to.equal(user.address);
        });
    });
});