// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "../interfaces/IBondingCurve.sol";

contract ExponentialCurve is IBondingCurve {
    uint256 public constant PRECISION = 1e18;
    uint256 public basePrice;
    uint256 public exponent;
    
    uint256 public totalVolume;
    uint256 public lastPrice;
    uint256 public lastUpdateTime;

    constructor(uint256 _basePrice, uint256 _exponent) {
        basePrice = _basePrice;
        exponent = _exponent;
        lastUpdateTime = block.timestamp;
        lastPrice = _basePrice;
    }

    function calculatePurchaseReturn(
        uint256 supply, 
        uint256 amount
    ) external view override returns (uint256) {  // Changed from pure to view
        uint256 currentPrice = _calculatePrice(supply);
        return (amount * PRECISION) / currentPrice;
    }

    function calculateSaleReturn(
        uint256 supply, 
        uint256 amount
    ) external view override returns (uint256) {  // Changed from pure to view
        require(supply > amount, "Amount too large");
        uint256 avgPrice = (_calculatePrice(supply) + _calculatePrice(supply - amount)) / 2;
        return (amount * avgPrice) / PRECISION;
    }

    function getCurrentPrice(
        uint256 supply
    ) external view override returns (uint256) {
        return _calculatePrice(supply);
    }

    function getSpotPrice(
        uint256 supply
    ) external view override returns (uint256) {
        return _calculatePrice(supply);
    }

    function getPriceImpact(
        uint256 supply,
        uint256 amount,
        bool isBuy
    ) external view override returns (uint256) {
        uint256 currentPrice = _calculatePrice(supply);
        
        uint256 nextPrice = isBuy ? 
            _calculatePrice(supply + amount) :
            _calculatePrice(supply - amount);

        if (isBuy) {
            if (nextPrice <= currentPrice) return 0;
            return ((nextPrice - currentPrice) * PRECISION) / currentPrice;
        } else {
            if (nextPrice >= currentPrice) return 0;
            return ((currentPrice - nextPrice) * PRECISION) / currentPrice;
        }
    }

    function getSlope() external view override returns (uint256) {
        return exponent;
    }

    // Changed from view to pure since PRECISION is a constant
    function getPrecision() external pure override returns (uint256) {
        return PRECISION;
    }

    // Internal function to calculate price based on supply
    function _calculatePrice(uint256 supply) internal view returns (uint256) {
        if (supply == 0) return basePrice;
        
        // price = basePrice * (1 + supply/PRECISION)^exponent
        uint256 base = PRECISION + (supply * PRECISION) / PRECISION;
        uint256 result = basePrice;
        
        for (uint256 i = 0; i < exponent; i++) {
            result = (result * base) / PRECISION;
        }
        
        return result;
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