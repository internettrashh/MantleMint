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
}