// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "../interfaces/IBondingCurve.sol";

contract LinearCurve is IBondingCurve {
    uint256 public constant PRECISION = 1e18;
    uint256 public constant BASE_PRICE = 10000000000000; // 0.00001 ether
    uint256 public slope;
    
    uint256 public totalVolume;
    uint256 public lastPrice;
    uint256 public lastUpdateTime;

    constructor(uint256 _slope) {
        slope = _slope / 2;
        lastUpdateTime = block.timestamp;
        lastPrice = BASE_PRICE; // Initialize lastPrice with BASE_PRICE
    }

   function calculatePurchaseReturn(
    uint256 supply, 
    uint256 amount
) external view override returns (uint256) {
    uint256 currentPrice = BASE_PRICE + (supply * slope) / PRECISION;
    return (amount * PRECISION) / currentPrice;
}
    function calculateSaleReturn(
        uint256 supply, 
        uint256 amount
    ) external view override returns (uint256) {
        require(supply > amount, "Amount too large");
        uint256 avgPrice = (BASE_PRICE + (supply * slope) / PRECISION + 
                           BASE_PRICE + ((supply - amount) * slope) / PRECISION) / 2;
        return (amount * avgPrice) / PRECISION;
    }

    function getCurrentPrice(
        uint256 supply
    ) external view override returns (uint256) {
        return BASE_PRICE + (supply * slope) / PRECISION;
    }

    function getSpotPrice(
        uint256 supply
    ) external view override returns (uint256) {
        return BASE_PRICE + (supply * slope) / PRECISION;
    }

    function getPriceImpact(
        uint256 supply,
        uint256 amount,
        bool isBuy
    ) external view override returns (uint256) {
        uint256 currentPrice = BASE_PRICE + (supply * slope) / PRECISION;
        
        if (isBuy) {
            uint256 nextPrice = BASE_PRICE + ((supply + amount) * slope) / PRECISION;
            if (nextPrice <= currentPrice) return 0;
            return ((nextPrice - currentPrice) * PRECISION) / currentPrice;
        } else {
            if (amount >= supply) revert("Amount too large");
            uint256 nextPrice = BASE_PRICE + ((supply - amount) * slope) / PRECISION;
            if (nextPrice >= currentPrice) return 0;
            return ((currentPrice - nextPrice) * PRECISION) / currentPrice;
        }
    }

    function getSlope() external view override returns (uint256) {
        return slope;
    }

    function getPrecision() external pure override returns (uint256) {
        return PRECISION;
    }

    modifier validAmount(uint256 amount) {
        require(amount > 0, "Amount must be positive");
        require(amount < type(uint256).max / PRECISION, "Amount too large");
        _;
    }

    function _updateState(uint256 newPrice, uint256 volume, bool isBuy) internal {
        require(newPrice >= BASE_PRICE, "Price below base");
        uint256 oldPrice = lastPrice;
        lastPrice = newPrice;
        lastUpdateTime = block.timestamp;
        totalVolume += volume;
        
        emit PriceUpdate(oldPrice, newPrice, block.timestamp);
        emit VolumeUpdate(volume, isBuy, block.timestamp);
    }
}