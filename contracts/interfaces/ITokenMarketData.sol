// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

interface ITokenMarketData {
    // Data structures for returning multiple values
    struct PricePoint {
        uint256 price;
        uint256 timestamp;
        uint256 supply;
    }

    struct MarketStats {
        uint256 currentPrice;
        uint256 currentSupply;
        uint256 poolBalance;
        uint256 volume24h;
        uint256 highPrice24h;
        uint256 lowPrice24h;
    }

    // View functions - free to call
    function getCurrentStats() external view returns (MarketStats memory);
    function getPriceAtSupply(uint256 supply) external view returns (uint256);
    function simulateBuyPrice(uint256 ethAmount) external view returns (uint256 tokenAmount, uint256 priceImpact);
    function simulateSellPrice(uint256 tokenAmount) external view returns (uint256 ethAmount, uint256 priceImpact);
    function getPriceHistory(uint256 fromTimestamp) external view returns (PricePoint[] memory);
    function getTheoreticalPricePoints(
        uint256 numPoints, 
        uint256 startSupply, 
        uint256 endSupply
    ) external view returns (PricePoint[] memory);
}