# Codebase Contents
## Project Structure
```




```
## File: /Users/nischalnaik/Documents/mantle/contracts/core/BondedToken.sol
```
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
}```

## File: /Users/nischalnaik/Documents/mantle/contracts/core/TokenFactory.sol
```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;
import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IBondingCurve.sol";
import "../curves/LinearCurve.sol";
import "../curves/ExponentialCurve.sol";
import "../curves/LogarithmicCurve.sol";
import "../curves/SigmoidCurve.sol";
import "./BondedToken.sol";

contract TokenFactory is Ownable {
    enum CurveType { LINEAR, EXPONENTIAL, LOGARITHMIC, SIGMOID }
    
    struct TokenInfo {
        address tokenAddress;
        string name;
        string symbol;
        string description;
        CurveType curveType;
        address curveAddress;
        uint256 createdAt;
        address creator;
    }

    mapping(address => TokenInfo[]) public creatorTokens;
    TokenInfo[] public allTokens;
    
    event TokenCreated(
        address indexed tokenAddress,
        address indexed creator,
        string name,
        string symbol,
        CurveType curveType
    );

    constructor() Ownable(msg.sender) {}

    function createToken(
        string memory name,
        string memory symbol,
        string memory description,
        CurveType curveType,
        uint256 param1,  // slope/exponent/multiplier/steepness
        uint256 param2   // optional: midpoint for sigmoid
    ) external returns (address) {
        // Deploy the chosen bonding curve
        address curveAddress = _deployCurve(curveType, param1, param2);
        
        // Deploy the bonded token
        BondedToken token = new BondedToken(
            name,
            symbol,
            curveAddress,
            msg.sender
        );

        // Store token information
        TokenInfo memory newToken = TokenInfo({
            tokenAddress: address(token),
            name: name,
            symbol: symbol,
            description: description,
            curveType: curveType,
            curveAddress: curveAddress,
            createdAt: block.timestamp,
            creator: msg.sender
        });

        creatorTokens[msg.sender].push(newToken);
        allTokens.push(newToken);

        emit TokenCreated(
            address(token),
            msg.sender,
            name,
            symbol,
            curveType
        );

        return address(token);
    }

    function _deployCurve(
        CurveType curveType,
        uint256 param1,
        uint256 param2
    ) internal returns (address) {
        if (curveType == CurveType.LINEAR) {
            LinearCurve curve = new LinearCurve(param1); // param1 = slope
            return address(curve);
        } 
        else if (curveType == CurveType.EXPONENTIAL) {
            ExponentialCurve curve = new ExponentialCurve(param1); // param1 = exponent
            return address(curve);
        }
        else if (curveType == CurveType.LOGARITHMIC) {
            LogarithmicCurve curve = new LogarithmicCurve(param1); // param1 = multiplier
            return address(curve);
        }
        else if (curveType == CurveType.SIGMOID) {
            SigmoidCurve curve = new SigmoidCurve(param1, param2); // param1 = steepness, param2 = midpoint
            return address(curve);
        }
        revert("Invalid curve type");
    }

    // View functions
    function getTokensByCreator(address creator) external view returns (TokenInfo[] memory) {
        return creatorTokens[creator];
    }

    function getAllTokens() external view returns (TokenInfo[] memory) {
        return allTokens;
    }

    function getTokenCount() external view returns (uint256) {
        return allTokens.length;
    }

    function getCreatorTokenCount(address creator) external view returns (uint256) {
        return creatorTokens[creator].length;
    }
}```

## File: /Users/nischalnaik/Documents/mantle/contracts/interfaces/IBondingCurve.sol
```
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
```

## File: /Users/nischalnaik/Documents/mantle/contracts/interfaces/ITokenMarketData.sol
```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

interface ITokenMarketData {
    // Data structures for returning multiple values
    struct PricePoint {
        uint256 price;
        uint256 timestamp;
        uint256 supply;
    }

    struct MarketStats {
        uint256 currentPrice;
        uint256 currentSupply;
        uint256 poolBalance;
        uint256 volume24h;
        uint256 highPrice24h;
        uint256 lowPrice24h;
    }

    // View functions - free to call
    function getCurrentStats() external view returns (MarketStats memory);
    function getPriceAtSupply(uint256 supply) external view returns (uint256);
    function simulateBuyPrice(uint256 ethAmount) external view returns (uint256 tokenAmount, uint256 priceImpact);
    function simulateSellPrice(uint256 tokenAmount) external view returns (uint256 ethAmount, uint256 priceImpact);
    function getPriceHistory(uint256 fromTimestamp) external view returns (PricePoint[] memory);
    function getTheoreticalPricePoints(
        uint256 numPoints, 
        uint256 startSupply, 
        uint256 endSupply
    ) external view returns (PricePoint[] memory);
}```

## File: /Users/nischalnaik/Documents/mantle/contracts/curves/ExponentialCurve.sol
```
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
}```

