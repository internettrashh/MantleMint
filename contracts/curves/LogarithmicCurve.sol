// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "../interfaces/IBondingCurve.sol";

contract LogarithmicCurve is IBondingCurve {
    uint256 public constant PRECISION = 1e18;
    uint256 public constant BASE_PRICE = 10000000000000; // 0.00001 ether
    uint256 public multiplier;

    uint256 public totalVolume;
    uint256 public lastPrice;
    uint256 public lastUpdateTime;

    constructor(uint256 _multiplier) {
        multiplier = _multiplier;
        lastUpdateTime = block.timestamp;
        lastPrice = BASE_PRICE; // Initialize with BASE_PRICE
    }

    function calculatePurchaseReturn(
        uint256 supply,
        uint256 amount
    ) external view override returns (uint256) {
        if (supply == 0) return (amount * PRECISION) / BASE_PRICE;

        // For logarithmic curve: price = BASE_PRICE * ln(1 + supply/PRECISION) * multiplier
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

        uint256 nextPrice = isBuy
            ? _calculatePrice(supply + amount)
            : _calculatePrice(supply - amount);

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

    function _ln(uint256 x) internal pure returns (uint256) {
        // Enhanced precision for ln calculation
        require(x > 0, "Invalid input");
        uint256 result = 0;

        while (x >= 2 * PRECISION) {
            result += PRECISION;
            x = (x * PRECISION) / (2 * PRECISION);
        }

        x = ((x - PRECISION) * PRECISION) / x;
        uint256 term = x;
        result += term;

        for (uint8 i = 2; i <= 10; i++) {
            term = (term * x * (i - 1)) / (i * PRECISION);
            result += term;
        }

        return result;
    }

    function _calculatePrice(uint256 supply) internal view returns (uint256) {
        if (supply == 0) return BASE_PRICE;

        // Corrected logarithmic growth calculation
        uint256 logComponent = (_ln(supply + PRECISION) * multiplier) / PRECISION;
        return BASE_PRICE + (BASE_PRICE * logComponent) / PRECISION;
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
