// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "../interfaces/IBondingCurve.sol";

contract ExponentialCurve is IBondingCurve {
    uint256 public constant PRECISION = 1e18;
    uint256 public constant BASE_PRICE = 10000000000000; // 0.00001 ether
    uint256 public base;  // exponential base
    
    uint256 public totalVolume;
    uint256 public lastPrice;
    uint256 public lastUpdateTime;

    constructor(uint256 _base) {
        base = _base + 1000;  // Add offset to increase growth rate
        lastUpdateTime = block.timestamp;
        lastPrice = BASE_PRICE;  // Initialize with BASE_PRICE
    }

    function calculatePurchaseReturn(
        uint256 supply, 
        uint256 amount
    ) external view override returns (uint256) {
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
        return base;
    }

    function getPrecision() external pure override returns (uint256) {
        return PRECISION;
    }

    // Internal function to calculate price based on supply
    function _calculatePrice(uint256 supply) internal view returns (uint256) {
        if (supply == 0) return BASE_PRICE;
        
        // Make the growth more aggressive
        uint256 exponent = (supply * base * PRECISION) / (1000 * PRECISION);
        return BASE_PRICE + ((BASE_PRICE * exponent) / PRECISION);
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

    modifier validAmount(uint256 amount) {
        require(amount > 0, "Amount must be positive");
        require(amount < type(uint256).max / PRECISION, "Amount too large");
        _;
    }
}