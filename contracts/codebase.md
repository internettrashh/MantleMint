# Codebase Contents
## Project Structure
```
.
├── README.md
├── artifacts
│   ├── @openzeppelin
│   │   └── contracts
│   │       ├── access
│   │       │   └── Ownable.sol
│   │       │       ├── Ownable.dbg.json
│   │       │       └── Ownable.json
│   │       ├── interfaces
│   │       │   └── draft-IERC6093.sol
│   │       │       ├── IERC1155Errors.dbg.json
│   │       │       ├── IERC1155Errors.json
│   │       │       ├── IERC20Errors.dbg.json
│   │       │       ├── IERC20Errors.json
│   │       │       ├── IERC721Errors.dbg.json
│   │       │       └── IERC721Errors.json
│   │       ├── token
│   │       │   └── ERC20
│   │       │       ├── ERC20.sol
│   │       │       │   ├── ERC20.dbg.json
│   │       │       │   └── ERC20.json
│   │       │       ├── IERC20.sol
│   │       │       │   ├── IERC20.dbg.json
│   │       │       │   └── IERC20.json
│   │       │       └── extensions
│   │       │           └── IERC20Metadata.sol
│   │       │               ├── IERC20Metadata.dbg.json
│   │       │               └── IERC20Metadata.json
│   │       └── utils
│   │           └── Context.sol
│   │               ├── Context.dbg.json
│   │               └── Context.json
│   ├── build-info
│   │   ├── 0ae454fe0edd9ce82e4d1b52bc56966a.json
│   │   ├── 1f4664dbba5b41febc78e0a4bd35c7b1.json
│   │   ├── 9a562503624112020856d3c91037a7a6.json
│   │   └── a378c918df5916ab610b7d8b554767b2.json
│   └── contracts
│       ├── Lock.sol
│       │   ├── Lock.dbg.json
│       │   └── Lock.json
│       ├── core
│       │   ├── BondedToken.sol
│       │   │   ├── BondedToken.dbg.json
│       │   │   └── BondedToken.json
│       │   └── TokenFactory.sol
│       │       ├── TokenFactory.dbg.json
│       │       └── TokenFactory.json
│       ├── curves
│       │   ├── ExponentialCurve.sol
│       │   │   ├── ExponentialCurve.dbg.json
│       │   │   └── ExponentialCurve.json
│       │   ├── LinearCurve.sol
│       │   │   ├── LinearCurve.dbg.json
│       │   │   └── LinearCurve.json
│       │   ├── LogarithmicCurve.sol
│       │   │   ├── LogarithmicCurve.dbg.json
│       │   │   └── LogarithmicCurve.json
│       │   └── SigmoidCurve.sol
│       │       ├── SigmoidCurve.dbg.json
│       │       └── SigmoidCurve.json
│       └── interfaces
│           ├── IBondingCurve.sol
│           │   ├── IBondingCurve.dbg.json
│           │   └── IBondingCurve.json
│           └── ITokenMarketData.sol
│               ├── ITokenMarketData.dbg.json
│               └── ITokenMarketData.json
├── cache
│   └── solidity-files-cache.json
├── codebase.md
├── contracts
│   ├── Lock.sol
│   ├── codebase.md
│   ├── core
│   │   ├── BondedToken.sol
│   │   └── TokenFactory.sol
│   ├── curves
│   │   ├── ExponentialCurve.sol
│   │   ├── LinearCurve.sol
│   │   ├── LogarithmicCurve.sol
│   │   └── SigmoidCurve.sol
│   ├── flattern.sh
│   ├── interfaces
│   │   ├── IBondingCurve.sol
│   │   └── ITokenMarketData.sol
│   └── utils
├── deploy.ts
├── fronted
│   ├── LICENSE
│   ├── README.md
│   ├── components.json
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── public
│   │   └── vite.svg
│   ├── src
│   │   ├── App.tsx
│   │   ├── app
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── assets
│   │   │   └── react.svg
│   │   ├── components
│   │   │   ├── TokenTester.tsx
│   │   │   ├── count-btn.tsx
│   │   │   └── ui
│   │   │       ├── badge.tsx
│   │   │       ├── button.tsx
│   │   │       ├── card.tsx
│   │   │       ├── input.tsx
│   │   │       └── table.tsx
│   │   ├── lib
│   │   │   └── utils.ts
│   │   ├── main.tsx
│   │   ├── styles
│   │   │   └── globals.css
│   │   └── vite-env.d.ts
│   ├── styles
│   │   └── globals.css
│   ├── tailwind.config.ts
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── hardhat.config.ts
├── ignition
│   └── modules
│       └── Lock.ts
├── package-lock.json
├── package.json
├── test
│   ├── Test.ts
│   └── tokenfactory.test.ts
├── tsconfig.json
└── typechain-types
    ├── @openzeppelin
    │   ├── contracts
    │   │   ├── access
    │   │   │   ├── Ownable.ts
    │   │   │   └── index.ts
    │   │   ├── index.ts
    │   │   ├── interfaces
    │   │   │   ├── draft-IERC6093.sol
    │   │   │   │   ├── IERC1155Errors.ts
    │   │   │   │   ├── IERC20Errors.ts
    │   │   │   │   ├── IERC721Errors.ts
    │   │   │   │   └── index.ts
    │   │   │   └── index.ts
    │   │   └── token
    │   │       ├── ERC20
    │   │       │   ├── ERC20.ts
    │   │       │   ├── IERC20.ts
    │   │       │   ├── extensions
    │   │       │   │   ├── IERC20Metadata.ts
    │   │       │   │   └── index.ts
    │   │       │   └── index.ts
    │   │       └── index.ts
    │   └── index.ts
    ├── common.ts
    ├── contracts
    │   ├── Lock.ts
    │   ├── core
    │   │   ├── BondedToken.ts
    │   │   ├── TokenFactory.ts
    │   │   └── index.ts
    │   ├── curves
    │   │   ├── ExponentialCurve.ts
    │   │   ├── LinearCurve.ts
    │   │   ├── LogarithmicCurve.ts
    │   │   ├── SigmoidCurve.ts
    │   │   └── index.ts
    │   ├── index.ts
    │   └── interfaces
    │       ├── IBondingCurve.ts
    │       ├── ITokenMarketData.ts
    │       └── index.ts
    ├── factories
    │   ├── @openzeppelin
    │   │   ├── contracts
    │   │   │   ├── access
    │   │   │   │   ├── Ownable__factory.ts
    │   │   │   │   └── index.ts
    │   │   │   ├── index.ts
    │   │   │   ├── interfaces
    │   │   │   │   ├── draft-IERC6093.sol
    │   │   │   │   │   ├── IERC1155Errors__factory.ts
    │   │   │   │   │   ├── IERC20Errors__factory.ts
    │   │   │   │   │   ├── IERC721Errors__factory.ts
    │   │   │   │   │   └── index.ts
    │   │   │   │   └── index.ts
    │   │   │   └── token
    │   │   │       ├── ERC20
    │   │   │       │   ├── ERC20__factory.ts
    │   │   │       │   ├── IERC20__factory.ts
    │   │   │       │   ├── extensions
    │   │   │       │   │   ├── IERC20Metadata__factory.ts
    │   │   │       │   │   └── index.ts
    │   │   │       │   └── index.ts
    │   │   │       └── index.ts
    │   │   └── index.ts
    │   ├── contracts
    │   │   ├── Lock__factory.ts
    │   │   ├── core
    │   │   │   ├── BondedToken__factory.ts
    │   │   │   ├── TokenFactory__factory.ts
    │   │   │   └── index.ts
    │   │   ├── curves
    │   │   │   ├── ExponentialCurve__factory.ts
    │   │   │   ├── LinearCurve__factory.ts
    │   │   │   ├── LogarithmicCurve__factory.ts
    │   │   │   ├── SigmoidCurve__factory.ts
    │   │   │   └── index.ts
    │   │   ├── index.ts
    │   │   └── interfaces
    │   │       ├── IBondingCurve__factory.ts
    │   │       ├── ITokenMarketData__factory.ts
    │   │       └── index.ts
    │   └── index.ts
    ├── hardhat.d.ts
    └── index.ts

75 directories, 150 files
```

## File: ./package.json
```
{
  "name": "mantle",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "devDependencies": {
    "@nomicfoundation/hardhat-toolbox": "^5.0.0",
    "@typechain/ethers-v6": "^0.5.1",
    "@typechain/hardhat": "^9.1.0",
    "hardhat": "^2.22.16",
    "typechain": "^8.3.2"
  },
  "dependencies": {
    "@openzeppelin/contracts": "^5.1.0"
  }
}
```

## File: ./tsconfig.json
```
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  }
}
```

## File: /Users/nischalnaik/Documents/mantle/contracts/Lock.sol
```
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Lock {
    uint public unlockTime;
    address payable public owner;

    event Withdrawal(uint amount, uint when);

    constructor(uint _unlockTime) payable {
        require(
            block.timestamp < _unlockTime,
            "Unlock time should be in the future"
        );

        unlockTime = _unlockTime;
        owner = payable(msg.sender);
    }

    function withdraw() public {
        // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
        // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);

        require(block.timestamp >= unlockTime, "You can't withdraw yet");
        require(msg.sender == owner, "You aren't the owner");

        emit Withdrawal(address(this).balance, block.timestamp);

        owner.transfer(address(this).balance);
    }
}
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

## File: /Users/nischalnaik/Documents/mantle/contracts/curves/LinearCurve.sol
```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "../interfaces/IBondingCurve.sol";

contract LinearCurve is IBondingCurve {
    uint256 public constant PRECISION = 1e18;
    uint256 public constant BASE_PRICE = 10000000000000; // 0.00001 ether
    uint256 public slope;
    
    uint256 public totalVolume;
    uint256 public lastPrice;
    uint256 public lastUpdateTime;

    constructor(uint256 _slope) {
        slope = _slope / 2;
        lastUpdateTime = block.timestamp;
        lastPrice = BASE_PRICE; // Initialize lastPrice with BASE_PRICE
    }

   function calculatePurchaseReturn(
    uint256 supply, 
    uint256 amount
) external view override returns (uint256) {
    uint256 currentPrice = BASE_PRICE + (supply * slope) / PRECISION;
    return (amount * PRECISION) / currentPrice;
}
    function calculateSaleReturn(
        uint256 supply, 
        uint256 amount
    ) external view override returns (uint256) {
        require(supply > amount, "Amount too large");
        uint256 avgPrice = (BASE_PRICE + (supply * slope) / PRECISION + 
                           BASE_PRICE + ((supply - amount) * slope) / PRECISION) / 2;
        return (amount * avgPrice) / PRECISION;
    }

    function getCurrentPrice(
        uint256 supply
    ) external view override returns (uint256) {
        return BASE_PRICE + (supply * slope) / PRECISION;
    }

    function getSpotPrice(
        uint256 supply
    ) external view override returns (uint256) {
        return BASE_PRICE + (supply * slope) / PRECISION;
    }

    function getPriceImpact(
        uint256 supply,
        uint256 amount,
        bool isBuy
    ) external view override returns (uint256) {
        uint256 currentPrice = BASE_PRICE + (supply * slope) / PRECISION;
        
        if (isBuy) {
            uint256 nextPrice = BASE_PRICE + ((supply + amount) * slope) / PRECISION;
            if (nextPrice <= currentPrice) return 0;
            return ((nextPrice - currentPrice) * PRECISION) / currentPrice;
        } else {
            if (amount >= supply) revert("Amount too large");
            uint256 nextPrice = BASE_PRICE + ((supply - amount) * slope) / PRECISION;
            if (nextPrice >= currentPrice) return 0;
            return ((currentPrice - nextPrice) * PRECISION) / currentPrice;
        }
    }

    function getSlope() external view override returns (uint256) {
        return slope;
    }

    function getPrecision() external pure override returns (uint256) {
        return PRECISION;
    }

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
}```

## File: /Users/nischalnaik/Documents/mantle/contracts/curves/LogarithmicCurve.sol
```
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
```

## File: /Users/nischalnaik/Documents/mantle/contracts/curves/SigmoidCurve.sol
```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "../interfaces/IBondingCurve.sol";

contract SigmoidCurve is IBondingCurve {
    uint256 public constant PRECISION = 1e18;
    uint256 public constant BASE_PRICE = 10000000000000; // 0.00001 ether
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
}```

## File: ./deploy.ts
```
import { ethers } from "hardhat";
import * as hre from "hardhat";

// Custom sleep function
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const TIMEOUT = 60000; // 60 seconds

async function deployWithRetry(contractName: string, factory: any, args: any[] = [], retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            console.log(`Deploying ${contractName}... (Attempt ${i + 1}/${retries})`);
            const contract = await factory.deploy(...args);
            await contract.waitForDeployment();
            console.log(`${contractName} deployed to:`, await contract.getAddress());
            return contract;
        } catch (error: any) {
            if (i === retries - 1) throw error; // Last attempt failed
            console.log(`Deployment attempt failed, retrying in 5 seconds...`);
            await sleep(5000); // Wait 5 seconds before retrying
        }
    }
}

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

    try {
        // Deploy TokenFactory with retry logic
        const TokenFactory = await ethers.getContractFactory("TokenFactory");
        const tokenFactory = await deployWithRetry("TokenFactory", TokenFactory);

        const tokenFactoryAddress = await tokenFactory.getAddress();

        // Wait for more confirmations with timeout handling
        console.log("Waiting for confirmations...");
        try {
            await Promise.race([
                tokenFactory.deploymentTransaction()?.wait(6),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error("Confirmation timeout")), TIMEOUT)
                )
            ]);
        } catch (error: any) {
            console.log("Warning: Confirmation wait timed out, continuing...");
        }

        // Verify contract
        if (process.env.ETHERSCAN_API_KEY) {
            console.log("Verifying contract on Etherscan...");
            try {
                await hre.run("verify:verify", {
                    address: tokenFactoryAddress,
                    constructorArguments: []
                });
                console.log("Contract verified successfully");
            } catch (error: any) {
                if (error.message.toLowerCase().includes("already verified")) {
                    console.log("Contract already verified");
                } else {
                    console.error("Verification error:", error);
                }
            }
        }

        // Create a sample token
        console.log("Creating sample token...");
        const tx = await tokenFactory.createToken(
            "Sample Token",
            "SMPL",
            "A sample token with linear bonding curve",
            0, // LINEAR curve
            ethers.parseEther("0.000000001"),  // slope
            0 // unused parameter
        );

        await tx.wait();
        console.log("Sample token created!");

        // Get the created token info
        const allTokens = await tokenFactory.getAllTokens();
        console.log("Sample token address:", allTokens[0].tokenAddress);

    } catch (error) {
        console.error("Deployment failed:", error);
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });```

## File: ./hardhat.config.ts
```
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

// Ensure you have a valid API key
if (!process.env.ALCHEMY_API_KEY) {
  throw new Error("Missing ALCHEMY_API_KEY environment variable");
}

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.27",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      timeout: 60000, // 60 seconds
      gasPrice: "auto",
      gas: "auto",
      httpHeaders: {
        "User-Agent": "hardhat",
      },
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  mocha: {
    timeout: 100000, // 100 seconds
  },
};

export default config;```

