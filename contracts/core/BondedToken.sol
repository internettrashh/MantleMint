// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IBondingCurve.sol";

contract BondedToken is ERC20, Ownable {
    IBondingCurve public bondingCurve;
    IERC20 public paymentToken;
    bool public isNativePayment;

    event Buy(address indexed buyer, uint256 amount, uint256 payment);
    event Sell(address indexed seller, uint256 amount, uint256 payment);

    constructor(
        string memory name,
        string memory symbol,
        address _bondingCurve,
        address _paymentToken,
        address initialOwner
    ) ERC20(name, symbol) Ownable(initialOwner) {
        bondingCurve = IBondingCurve(_bondingCurve);
        isNativePayment = _paymentToken == address(0);
        if (!isNativePayment) {
            paymentToken = IERC20(_paymentToken);
        }
    }

    function buy(uint256 amount) external payable {
        uint256 price = bondingCurve.calculatePurchaseReturn(totalSupply(), amount);
        
        if (isNativePayment) {
            require(msg.value >= price, "Insufficient payment");
            
            if (msg.value > price) {
                (bool success, ) = msg.sender.call{value: msg.value - price}("");
                require(success, "Refund failed");
            }
        } else {
            require(paymentToken.transferFrom(msg.sender, address(this), price), 
                "Payment token transfer failed");
        }

        _mint(msg.sender, amount);
        emit Buy(msg.sender, amount, price);
    }

    function sell(uint256 amount) external {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        uint256 returnAmount = bondingCurve.calculateSaleReturn(totalSupply(), amount);
        _burn(msg.sender, amount);

        if (isNativePayment) {
            (bool success, ) = msg.sender.call{value: returnAmount}("");
            require(success, "ETH transfer failed");
        } else {
            require(paymentToken.transfer(msg.sender, returnAmount), 
                "Payment token transfer failed");
        }

        emit Sell(msg.sender, amount, returnAmount);
    }

    function withdrawStuckTokens(address token, uint256 amount) external onlyOwner {
        require(!isNativePayment && token != address(paymentToken), 
            "Cannot withdraw payment token");
        IERC20(token).transfer(owner(), amount);
    }

    receive() external payable {}
}