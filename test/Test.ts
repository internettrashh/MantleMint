import { expect } from "chai";
import { ethers } from "hardhat";
import { LinearCurve, ExponentialCurve, LogarithmicCurve, SigmoidCurve } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("Bonding Curve Comparison", function () {
    let linearCurve: LinearCurve;
    let exponentialCurve: ExponentialCurve;
    let logarithmicCurve: LogarithmicCurve;
    let sigmoidCurve: SigmoidCurve;
    let owner: SignerWithAddress;

    beforeEach(async function () {
        [owner] = await ethers.getSigners();
        
        // Deploy curves
        const LinearCurveFactory = await ethers.getContractFactory("LinearCurve");
        const ExponentialCurveFactory = await ethers.getContractFactory("ExponentialCurve");
        const LogarithmicCurveFactory = await ethers.getContractFactory("LogarithmicCurve");
        const SigmoidCurveFactory = await ethers.getContractFactory("SigmoidCurve");

        linearCurve = await LinearCurveFactory.deploy(ethers.parseEther("0.1"));
        exponentialCurve = await ExponentialCurveFactory.deploy(ethers.parseEther("0.1"), 2);
        logarithmicCurve = await LogarithmicCurveFactory.deploy(
            ethers.parseEther("0.1"),
            ethers.parseEther("1")  // multiplier of 1 for baseline comparison
        );
        sigmoidCurve = await SigmoidCurveFactory.deploy(
            ethers.parseEther("0.1"),  // basePrice
            ethers.parseEther("0.01"),  // steepness
            ethers.parseEther("5000")  // midpoint at 5000 tokens
        );

        await Promise.all([
            linearCurve.waitForDeployment(),
            exponentialCurve.waitForDeployment(),
            logarithmicCurve.waitForDeployment(),
            sigmoidCurve.waitForDeployment()
        ]);
    });

    describe("Price Growth Comparison", function () {
        it("Should compare price growth between curves", async function () {
            const supplies = [
                ethers.parseEther("100"),
                ethers.parseEther("1000"),
                ethers.parseEther("5000"),  // Added midpoint
                ethers.parseEther("10000")
            ];

            console.log("\nPrice Growth Comparison:");
            console.log("Supply\t\tLinear\t\tExponential\tLogarithmic\tSigmoid");
            
            for (const supply of supplies) {
                const linearPrice = await linearCurve.getCurrentPrice(supply);
                const expPrice = await exponentialCurve.getCurrentPrice(supply);
                const logPrice = await logarithmicCurve.getCurrentPrice(supply);
                const sigPrice = await sigmoidCurve.getCurrentPrice(supply);
                
                console.log(
                    `${ethers.formatEther(supply)}\t${ethers.formatEther(linearPrice)}\t` +
                    `${ethers.formatEther(expPrice)}\t${ethers.formatEther(logPrice)}\t` +
                    `${ethers.formatEther(sigPrice)}`
                );
                
                // Verify relative growth rates
                if (supply > ethers.parseEther("1000")) {
                    expect(expPrice).to.be.gt(linearPrice);
                    expect(linearPrice).to.be.gt(logPrice);
                }
            }
        });

        it("Should compare purchase returns", async function () {
            const supply = ethers.parseEther("1000");
            const ethAmount = ethers.parseEther("1");
            
            const linearTokens = await linearCurve.calculatePurchaseReturn(supply, ethAmount);
            const expTokens = await exponentialCurve.calculatePurchaseReturn(supply, ethAmount);
            const logTokens = await logarithmicCurve.calculatePurchaseReturn(supply, ethAmount);
            const sigTokens = await sigmoidCurve.calculatePurchaseReturn(supply, ethAmount);
            
            console.log("\nPurchase Returns Comparison:");
            console.log(`Linear Tokens for 1 ETH: ${ethers.formatEther(linearTokens)}`);
            console.log(`Exponential Tokens for 1 ETH: ${ethers.formatEther(expTokens)}`);
            console.log(`Logarithmic Tokens for 1 ETH: ${ethers.formatEther(logTokens)}`);
            console.log(`Sigmoid Tokens for 1 ETH: ${ethers.formatEther(sigTokens)}`);
            
            // Verify token return relationships
            expect(logTokens).to.be.gt(linearTokens);
            expect(linearTokens).to.be.gt(expTokens);
        });

        it("Should compare price impacts", async function () {
            const supply = ethers.parseEther("1000");
            const amounts = [
                ethers.parseEther("10"),
                ethers.parseEther("100"),
                ethers.parseEther("1000")
            ];

            console.log("\nPrice Impact Comparison:");
            console.log("Amount\t\tLinear\t\tExponential\tLogarithmic\tSigmoid");
            
            for (const amount of amounts) {
                const linearImpact = await linearCurve.getPriceImpact(supply, amount, true);
                const expImpact = await exponentialCurve.getPriceImpact(supply, amount, true);
                const logImpact = await logarithmicCurve.getPriceImpact(supply, amount, true);
                const sigImpact = await sigmoidCurve.getPriceImpact(supply, amount, true);
                
                console.log(
                    `${ethers.formatEther(amount)}\t${ethers.formatEther(linearImpact)}%\t` +
                    `${ethers.formatEther(expImpact)}%\t${ethers.formatEther(logImpact)}%\t` +
                    `${ethers.formatEther(sigImpact)}%`
                );
                
                // Verify impact relationships
                expect(expImpact).to.be.gt(linearImpact);
                expect(linearImpact).to.be.gt(logImpact);
            }
        });

        it("Should compare sell returns", async function () {
            const supply = ethers.parseEther("10000");
            const sellAmount = ethers.parseEther("1000");
            
            const linearReturn = await linearCurve.calculateSaleReturn(supply, sellAmount);
            const expReturn = await exponentialCurve.calculateSaleReturn(supply, sellAmount);
            const logReturn = await logarithmicCurve.calculateSaleReturn(supply, sellAmount);
            const sigReturn = await sigmoidCurve.calculateSaleReturn(supply, sellAmount);
            
            console.log("\nSell Returns Comparison:");
            console.log(`Linear ETH Return: ${ethers.formatEther(linearReturn)}`);
            console.log(`Exponential ETH Return: ${ethers.formatEther(expReturn)}`);
            console.log(`Logarithmic ETH Return: ${ethers.formatEther(logReturn)}`);
            console.log(`Sigmoid ETH Return: ${ethers.formatEther(sigReturn)}`);
            
            // Verify return relationships
            expect(expReturn).to.be.gt(linearReturn);
            expect(linearReturn).to.be.gt(logReturn);
        });
    });

    describe("Market Dynamics", function () {
        it("Should demonstrate market depth", async function () {
            const supply = ethers.parseEther("1000");
            const buyAmounts = [
                ethers.parseEther("0.1"),
                ethers.parseEther("1"),
                ethers.parseEther("10")
            ];

            console.log("\nMarket Depth Comparison:");
            for (const amount of buyAmounts) {
                const linearTokens = await linearCurve.calculatePurchaseReturn(supply, amount);
                const expTokens = await exponentialCurve.calculatePurchaseReturn(supply, amount);
                const logTokens = await logarithmicCurve.calculatePurchaseReturn(supply, amount);
                const sigTokens = await sigmoidCurve.calculatePurchaseReturn(supply, amount);
                
                const linearPrice = await linearCurve.getCurrentPrice(supply);
                const expPrice = await exponentialCurve.getCurrentPrice(supply);
                const logPrice = await logarithmicCurve.getCurrentPrice(supply);
                const sigPrice = await sigmoidCurve.getCurrentPrice(supply);
                
                console.log(`\nBuy Amount: ${ethers.formatEther(amount)} ETH`);
                console.log(`Linear: ${ethers.formatEther(linearTokens)} tokens at ${ethers.formatEther(linearPrice)} ETH`);
                console.log(`Exponential: ${ethers.formatEther(expTokens)} tokens at ${ethers.formatEther(expPrice)} ETH`);
                console.log(`Logarithmic: ${ethers.formatEther(logTokens)} tokens at ${ethers.formatEther(logPrice)} ETH`);
                console.log(`Sigmoid: ${ethers.formatEther(sigTokens)} tokens at ${ethers.formatEther(sigPrice)} ETH`);

            }
        });

        it("Should verify price continuity", async function () {
            const testPoints = 5;
            const startSupply = ethers.parseEther("100");
            const endSupply = ethers.parseEther("1000");
            
            console.log("\nPrice Continuity Check:");
            for (let i = 0; i < testPoints; i++) {
                const supply = startSupply + (endSupply - startSupply) * BigInt(i) / BigInt(testPoints - 1);
                const linearPrice = await linearCurve.getSpotPrice(supply);
                const expPrice = await exponentialCurve.getSpotPrice(supply);
                const logPrice = await logarithmicCurve.getSpotPrice(supply);
             const sigPrice = await sigmoidCurve.getSpotPrice(supply);

                
                console.log(`\nSupply: ${ethers.formatEther(supply)}`);
                console.log(`Linear Price: ${ethers.formatEther(linearPrice)}`);
                console.log(`Exponential Price: ${ethers.formatEther(expPrice)}`);
                console.log(`Logarithmic Price: ${ethers.formatEther(logPrice)}`);
                console.log(`Sigmoid Price: ${ethers.formatEther(sigPrice)}`);

                
                // Verify prices are always positive
                expect(linearPrice).to.be.gt(0);
                expect(expPrice).to.be.gt(0);
                expect(logPrice).to.be.gt(0);
                expect(sigPrice).to.be.gt(0);

            }
        });
    });
});