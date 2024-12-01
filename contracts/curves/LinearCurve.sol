// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "../interfaces/IBondingCurve.sol";

contract LinearCurve is IBondingCurve {
    uint256 public constant PRECISION = 1e18;
    uint256 public slope;
    
    uint256 public totalVolume;
    uint256 public lastPrice;
    uint256 public lastUpdateTime;

    constructor(uint256 _slope) {
        slope = _slope;
        lastUpdateTime = block.timestamp;
        lastPrice = 0;
    }

    function calculatePurchaseReturn(
        uint256 supply, 
        uint256 amount
    ) external pure override returns (uint256) {
        return (amount * PRECISION) / (supply + PRECISION);
    }

    function calculateSaleReturn(
        uint256 supply, 
        uint256 amount
    ) external pure override returns (uint256) {
        require(supply > amount, "Amount too large");
        return (amount * (supply - amount)) / supply;
    }

    function getCurrentPrice(
        uint256 supply
    ) external view override returns (uint256) {
        return (supply * slope) / PRECISION;
    }

    function getSpotPrice(
        uint256 supply
    ) external view override returns (uint256) {
        return (supply * slope) / PRECISION;
    }

    function getPriceImpact(
        uint256 supply,
        uint256 amount,
        bool isBuy
    ) external view override returns (uint256) {
        uint256 currentPrice = (supply * slope) / PRECISION;
        
        if (isBuy) {
            uint256 nextPrice = ((supply + amount) * slope) / PRECISION;
            if (nextPrice <= currentPrice) return 0;
            return ((nextPrice - currentPrice) * PRECISION) / currentPrice;
        } else {
            if (amount >= supply) revert("Amount too large");
            uint256 nextPrice = ((supply - amount) * slope) / PRECISION;
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
    function _updateState(uint256 newPrice, uint256 volume, bool isBuy) internal {
        uint256 oldPrice = lastPrice;
        lastPrice = newPrice;
        lastUpdateTime = block.timestamp;
        totalVolume += volume;
        
        emit PriceUpdate(oldPrice, newPrice, block.timestamp);
        emit VolumeUpdate(volume, isBuy, block.timestamp);
    }
}