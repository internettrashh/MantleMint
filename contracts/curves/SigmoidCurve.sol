// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "../interfaces/IBondingCurve.sol";

contract SigmoidCurve is IBondingCurve {
    uint256 public constant PRECISION = 1e18;
    uint256 public basePrice;
    uint256 public steepness;
    uint256 public midpoint;
    
    uint256 public lastPrice;
    uint256 public lastUpdateTime;

    constructor(
        uint256 _basePrice,
        uint256 _steepness,
        uint256 _midpoint
    ) {
        basePrice = _basePrice;
        steepness = _steepness;
        midpoint = _midpoint;
        lastUpdateTime = block.timestamp;
        lastPrice = _basePrice;
    }

    function calculatePurchaseReturn(
        uint256 supply, 
        uint256 amount
    ) external view override returns (uint256) {
        if (supply == 0) return (amount * PRECISION) / basePrice;
        uint256 currentPrice = _calculatePrice(supply);
        return (amount * PRECISION) / currentPrice;
    }

    function calculateSaleReturn(
        uint256 supply, 
        uint256 amount
    ) external view override returns (uint256) {
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
        uint256 nextPrice;
        
        if (isBuy) {
            nextPrice = _calculatePrice(supply + amount);
            if (nextPrice <= currentPrice) return 0;
            return ((nextPrice - currentPrice) * PRECISION) / currentPrice;
        } else {
            if (supply <= amount) return PRECISION; // 100% impact
            nextPrice = _calculatePrice(supply - amount);
            if (nextPrice >= currentPrice) return 0;
            return ((currentPrice - nextPrice) * PRECISION) / currentPrice;
        }
    }

    function getSlope() external view override returns (uint256) {
        return steepness;
    }

    function getPrecision() external pure override returns (uint256) {
        return PRECISION;
    }

    // Simplified sigmoid calculation to prevent overflows
    function _calculatePrice(uint256 supply) internal view returns (uint256) {
        if (supply == 0) return basePrice;

        // Calculate normalized position relative to midpoint
        // Use subtraction first to prevent overflow
        int256 position;
        if (supply > midpoint) {
            position = int256((supply - midpoint) * steepness) / int256(PRECISION);
        } else {
            position = -int256((midpoint - supply) * steepness) / int256(PRECISION);
        }

        // Clamp position to prevent extreme values
        if (position > 10) position = 10;
        if (position < -10) position = -10;

        // Calculate sigmoid using simplified formula
        uint256 sigmoidValue;
        if (position >= 0) {
            sigmoidValue = PRECISION - (PRECISION / (1 + uint256(_exp(position))));
        } else {
            uint256 expVal = uint256(_exp(-position));
            sigmoidValue = PRECISION / (1 + expVal);
        }

        // Scale the price
        return (basePrice * (PRECISION + sigmoidValue)) / PRECISION;
    }

    // Simplified exponential calculation
    function _exp(int256 x) internal pure returns (int256) {
        // Use a simpler approximation for e^x
        int256 result = int256(PRECISION);
        int256 term = int256(PRECISION);
        
        for (uint8 i = 1; i <= 4; i++) {
            term = (term * x) / int256(PRECISION);
            if (i == 1) term = term / 1;
            if (i == 2) term = term / 2;
            if (i == 3) term = term / 6;
            if (i == 4) term = term / 24;
            result += term;
        }
        
        return result;
    }
}