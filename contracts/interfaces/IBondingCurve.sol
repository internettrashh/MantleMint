// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

interface IBondingCurve {
    // Events
    event PriceUpdate(uint256 oldPrice, uint256 newPrice, uint256 timestamp);
    event VolumeUpdate(uint256 volume, bool isBuy, uint256 timestamp);

    function calculatePurchaseReturn(uint256 supply, uint256 amount) external view returns (uint256);
    function calculateSaleReturn(uint256 supply, uint256 amount) external view returns (uint256);
    function getCurrentPrice(uint256 supply) external view returns (uint256);
    function getSpotPrice(uint256 supply) external view returns (uint256);
    function getPriceImpact(uint256 supply, uint256 amount, bool isBuy) external view returns (uint256);
    function getSlope() external view returns (uint256);
    function getPrecision() external pure returns (uint256);

}
