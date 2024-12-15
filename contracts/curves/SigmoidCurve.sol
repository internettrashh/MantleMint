// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "../interfaces/IBondingCurve.sol";

contract SigmoidCurve is IBondingCurve {
    uint256 public constant PRECISION = 1e18;
    uint256 public constant BASE_PRICE = 100_000_000_000_000_000; // 0.1 * 10^18
    uint256 public steepness;
    uint256 public midpoint;
    
    uint256 public lastPrice;
    uint256 public lastUpdateTime;
    uint256 public totalVolume;

    uint256 public constant PRICE_RANGE = 5 * BASE_PRICE;  // 0.00005 ether range

    constructor(
        uint256 _steepness,
        uint256 _midpoint
    ) {
        steepness = _steepness;
        midpoint = _midpoint;
        lastUpdateTime = block.timestamp;
        lastPrice = BASE_PRICE;
    }

    function calculatePurchaseReturn(
        uint256 supply, 
        uint256 amount
    ) external view override returns (uint256) {
        if (supply == 0) return (amount * PRECISION) / BASE_PRICE;
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

    function _exp(int256 x) internal pure returns (uint256) {
        require(x <= 50 && x >= -50, "Exp overflow");
        
        if (x == 0) return PRECISION;
        
        // Handle negative exponents
        if (x < 0) {
            x = -x;
            uint256 result = _exp_positive(uint256(x));
            return (PRECISION * PRECISION) / result;
        }
        
        return _exp_positive(uint256(x));
    }

    function _exp_positive(uint256 x) internal pure returns (uint256) {
        uint256 result = PRECISION;
        uint256 term = PRECISION;
        
        for (uint8 i = 1; i <= 8; i++) {
            term = (term * x) / (i * PRECISION);
            result += term;
        }
        
        return result;
    }

    // Simplified sigmoid calculation to prevent overflows
    function _calculatePrice(uint256 supply) internal view returns (uint256) {
        if (supply == 0) return BASE_PRICE;

        // Calculate normalized position
        int256 position;
        if (supply > midpoint) {
            position = int256((supply - midpoint) * steepness) / int256(PRECISION / 10);
            
        } else {
            position = -int256((midpoint - supply) * steepness) / int256(PRECISION / 10);
        }

        // Limit curve range
        if (position > 8) position = 8;
        if (position < -8) position = -8;

        // Calculate sigmoid value with better scaling
        uint256 sigmoidValue;
        if (position >= 0) {
            uint256 expVal = uint256(_exp(position));
            sigmoidValue = (expVal * PRECISION) / (PRECISION + expVal);
        } else {
            uint256 expVal = uint256(_exp(-position));
            sigmoidValue = (PRECISION * PRECISION) / (PRECISION + expVal);
        }

        // Price calculation with proper range
        uint256 priceIncrease = (PRICE_RANGE * sigmoidValue) / PRECISION;
        return BASE_PRICE + priceIncrease;
    }

    // Add to all curve contracts
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