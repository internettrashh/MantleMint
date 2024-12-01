// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IBondingCurve.sol";

contract BondedToken is ERC20, Ownable {
    IBondingCurve public bondingCurve;
    uint256 public constant PRECISION = 1e18;

    event TokensPurchased(address indexed buyer, uint256 ethAmount, uint256 tokenAmount);
    event TokensSold(address indexed seller, uint256 tokenAmount, uint256 ethAmount);

    constructor(
        string memory name,
        string memory symbol,
        address curveAddress,
        address initialOwner
    ) ERC20(name, symbol) Ownable(initialOwner) {
        bondingCurve = IBondingCurve(curveAddress);
    }

    function buy() external payable {
        require(msg.value > 0, "Must send ETH");
        
        uint256 tokensToMint = bondingCurve.calculatePurchaseReturn(
            totalSupply(),
            msg.value
        );
        
        require(tokensToMint > 0, "Zero tokens");
        _mint(msg.sender, tokensToMint);
        
        emit TokensPurchased(msg.sender, msg.value, tokensToMint);
    }

    function sell(uint256 tokenAmount) external {
        require(tokenAmount > 0, "Zero tokens");
        require(balanceOf(msg.sender) >= tokenAmount, "Insufficient balance");
        
        uint256 ethToReturn = bondingCurve.calculateSaleReturn(
            totalSupply(),
            tokenAmount
        );
        
        require(ethToReturn > 0, "Zero ETH return");
        require(address(this).balance >= ethToReturn, "Insufficient ETH in contract");
        
        _burn(msg.sender, tokenAmount);
        (bool success, ) = msg.sender.call{value: ethToReturn}("");
        require(success, "ETH transfer failed");
        
        emit TokensSold(msg.sender, tokenAmount, ethToReturn);
    }

    function getCurrentPrice() external view returns (uint256) {
        return bondingCurve.getCurrentPrice(totalSupply());
    }

    function getPriceImpact(uint256 amount, bool isBuy) external view returns (uint256) {
        return bondingCurve.getPriceImpact(totalSupply(), amount, isBuy);
    }

    // Allow contract to receive ETH
    receive() external payable {}
}