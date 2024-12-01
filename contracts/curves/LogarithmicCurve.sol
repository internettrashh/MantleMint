// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "../interfaces/IBondingCurve.sol";

contract LogarithmicCurve is IBondingCurve {
    uint256 public constant PRECISION = 1e18;
    uint256 public basePrice;
    uint256 public multiplier;
    
    uint256 public totalVolume;
    uint256 public lastPrice;
    uint256 public lastUpdateTime;

    constructor(uint256 _basePrice, uint256 _multiplier) {
        basePrice = _basePrice;
        multiplier = _multiplier;
        lastUpdateTime = block.timestamp;
        lastPrice = _basePrice;
    }

    function calculatePurchaseReturn(
        uint256 supply, 
        uint256 amount
    ) external view override returns (uint256) {
        if (supply == 0) return (amount * PRECISION) / basePrice;
        
        // For logarithmic curve: price = basePrice * ln(1 + supply/PRECISION) * multiplier
        uint256 currentPrice = _calculatePrice(supply);
        return (amount * PRECISION) / currentPrice;
    }

    function calculateSaleReturn(
        uint256 supply, 
        uint256 amount
    ) external view override returns (uint256) {
        require(supply > amount, "Amount too large");
        // Calculate average price over the range
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
        return multiplier;
    }

    function getPrecision() external pure override returns (uint256) {
        return PRECISION;
    }

    // Internal helper for natural log calculation
    function _ln(uint256 x) internal pure returns (uint256) {
        // Use a Taylor series approximation for ln(1 + x)
        require(x >= PRECISION, "Input too small");
        
        uint256 y = (x - PRECISION) * PRECISION / x;
        uint256 result = y;
        uint256 term = y;
        
        for (uint256 i = 2; i <= 10; i++) {
            term = (term * y) / PRECISION;
            if (i % 2 == 0) {
                result = result - (term / i);
            } else {
                result = result + (term / i);
            }
        }
        
        return result;
    }

    function _calculatePrice(uint256 supply) internal view returns (uint256) {
        if (supply == 0) return basePrice;
        
        // price = basePrice * ln(1 + supply/PRECISION) * multiplier
        uint256 normalizedSupply = PRECISION + ((supply * PRECISION) / PRECISION);
        uint256 logComponent = _ln(normalizedSupply);
        return (basePrice * multiplier * logComponent) / (PRECISION * PRECISION);
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