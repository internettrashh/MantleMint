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

    struct BasicTokenInfo {
        address tokenAddress;
        string name;
        string symbol;
        string description;
        CurveType curveType;
        address curveAddress;
        address paymentToken;
        uint256 createdAt;
        address creator;
    }

    struct CreatorInfo {
        string twitchUsername;
        string[] socialLinks;
        string profileImageUrl;
        string category;
    }
    
    struct TokenInfo {
        BasicTokenInfo basicInfo;
        CreatorInfo creatorInfo;
    }
    
    mapping(address => BasicTokenInfo[]) public creatorTokens;
    mapping(address => mapping(string => CreatorInfo)) public creatorProfiles;
    BasicTokenInfo[] public allTokens;
    
    event TokenCreated(
        address indexed tokenAddress,
        address indexed creator,
        string name,
        string symbol,
        CurveType curveType
    );

    constructor() Ownable(msg.sender) {}

    function createToken(
        BasicTokenInfo memory basicInfo,
        CreatorInfo memory creatorInfo,
        uint256 param1,
        uint256 param2
    ) external returns (address) {
        require(bytes(creatorInfo.twitchUsername).length > 0, "Twitch username required");
        require(creatorInfo.socialLinks.length <= 5, "Too many social links");
        
        address curveAddress = _deployCurve(basicInfo.curveType, param1, param2);
        
        BondedToken token = new BondedToken(
            basicInfo.name,
            basicInfo.symbol,
            curveAddress,
            basicInfo.paymentToken,
            msg.sender
        );

        basicInfo.tokenAddress = address(token);
        basicInfo.curveAddress = curveAddress;
        basicInfo.createdAt = block.timestamp;
        basicInfo.creator = msg.sender;

        creatorTokens[msg.sender].push(basicInfo);
        allTokens.push(basicInfo);
        creatorProfiles[msg.sender][basicInfo.symbol] = creatorInfo;

        emit TokenCreated(
            address(token),
            msg.sender,
            basicInfo.name,
            basicInfo.symbol,
            basicInfo.curveType
        );

        return address(token);
    }


    function _deployCurve(
        CurveType curveType,
        uint256 param1,
        uint256 param2
    ) internal returns (address) {
        if (curveType == CurveType.LINEAR) {
            LinearCurve curve = new LinearCurve(param1);
            return address(curve);
        } 
        else if (curveType == CurveType.EXPONENTIAL) {
            ExponentialCurve curve = new ExponentialCurve(param1);
            return address(curve);
        }
        else if (curveType == CurveType.LOGARITHMIC) {
            LogarithmicCurve curve = new LogarithmicCurve(param1);
            return address(curve);
        }
        else if (curveType == CurveType.SIGMOID) {
            SigmoidCurve curve = new SigmoidCurve(param1, param2);
            return address(curve);
        }
        revert("Invalid curve type");
    }

    function getTokensByCreator(address creator) external view returns (BasicTokenInfo[] memory) {
        return creatorTokens[creator];
    }

    function getAllTokens() external view returns (BasicTokenInfo[] memory) {
        return allTokens;
    }

    function getTokenCount() external view returns (uint256) {
        return allTokens.length;
    }

    function getCreatorTokenCount(address creator) external view returns (uint256) {
        return creatorTokens[creator].length;
    }

   function getAllTokensWithInfo() external view returns (TokenInfo[] memory) {
        TokenInfo[] memory tokensWithInfo = new TokenInfo[](allTokens.length);
        
        for (uint256 i = 0; i < allTokens.length; i++) {
            BasicTokenInfo memory currentToken = allTokens[i];
            address creatorAddress = currentToken.creator;
            
            CreatorInfo memory creator = creatorProfiles[creatorAddress][currentToken.symbol];
            
            require(bytes(creator.twitchUsername).length > 0, 
                string(abi.encodePacked("No creator info found for token: ", currentToken.name)));
            
            tokensWithInfo[i] = TokenInfo({
                basicInfo: currentToken,
                creatorInfo: creator
            });
        }
        
        return tokensWithInfo;
    }
}