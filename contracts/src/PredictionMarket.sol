// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockedUSDC is ERC20, Ownable {
    constructor() ERC20("Mocked USDC", "mUSDC") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10**decimals());
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }
}

contract PredictionToken is ERC20, Ownable {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) Ownable(msg.sender) {}

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }
}

contract PredictionMarket is Ownable {
    MockedUSDC public usdcToken;
    
    struct Market {
        uint256 id;
        string question;
        uint256 expirationTime;
        bool resolved;
        bool outcome;
        bool emergencyStopped;
        PredictionToken yesToken;
        PredictionToken noToken;
        uint256 reserve0;
        uint256 reserve1;
        uint256 k;
    }

    mapping(uint256 => Market) public markets;
    uint256 public marketCount;

    uint256 public constant SCALE = 1e18;
    uint256 public constant FEE_RATE = 3; // 0.3% fee

    event MarketCreated(uint256 indexed marketId, string question, uint256 expirationTime);
    event Swap(uint256 indexed marketId, address indexed user, bool isYes, uint256 amountIn, uint256 amountOut);
    event MarketResolved(uint256 indexed marketId, bool outcome);
    event EmergencyStop(uint256 indexed marketId);

    constructor(address _usdcToken) Ownable(msg.sender) {
        usdcToken = MockedUSDC(_usdcToken);
    }

    function createMarket(string memory _question, uint256 _expirationTime, uint256 _initialLiquidity) external onlyOwner {
        require(_expirationTime > block.timestamp, "Expiration must be in the future");
        require(_initialLiquidity > 0, "Initial liquidity must be greater than 0");

        marketCount++;
        Market storage newMarket = markets[marketCount];
        newMarket.id = marketCount;
        newMarket.question = _question;
        newMarket.expirationTime = _expirationTime;
        newMarket.yesToken = new PredictionToken(string(abi.encodePacked("YES", marketCount)), string(abi.encodePacked("YES", marketCount)));
        newMarket.noToken = new PredictionToken(string(abi.encodePacked("NO", marketCount)), string(abi.encodePacked("NO", marketCount)));
        newMarket.reserve0 = _initialLiquidity;
        newMarket.reserve1 = _initialLiquidity;
        newMarket.k = _initialLiquidity * _initialLiquidity;

        usdcToken.transferFrom(msg.sender, address(this), _initialLiquidity * 2);
        newMarket.yesToken.mint(address(this), _initialLiquidity);
        newMarket.noToken.mint(address(this), _initialLiquidity);

        emit MarketCreated(marketCount, _question, _expirationTime);
    }

    function swap(uint256 _marketId, bool isYes, uint256 amountIn) external returns (uint256 amountOut) {
        Market storage market = markets[_marketId];
        require(!market.resolved, "Market already resolved");
        require(!market.emergencyStopped, "Market is emergency stopped");
        require(block.timestamp < market.expirationTime, "Market has expired");
        require(amountIn > 0, "Amount must be greater than 0");

        uint256 reserveIn = isYes ? market.reserve0 : market.reserve1;
        uint256 reserveOut = isYes ? market.reserve1 : market.reserve0;

        uint256 amountInWithFee = amountIn * (1000 - FEE_RATE);
        amountOut = (amountInWithFee * reserveOut) / ((reserveIn * 1000) + amountInWithFee);

        require(amountOut > 0, "Insufficient output amount");

        if (isYes) {
            market.reserve0 = reserveIn + amountIn;
            market.reserve1 = reserveOut - amountOut;
            usdcToken.transferFrom(msg.sender, address(this), amountIn);
            market.noToken.transfer(msg.sender, amountOut);
        } else {
            market.reserve1 = reserveIn + amountIn;
            market.reserve0 = reserveOut - amountOut;
            usdcToken.transferFrom(msg.sender, address(this), amountIn);
            market.yesToken.transfer(msg.sender, amountOut);
        }

        uint256 newK = market.reserve0 * market.reserve1;
        require(newK >= market.k, "K value must not decrease");
        market.k = newK;

        emit Swap(_marketId, msg.sender, isYes, amountIn, amountOut);
    }

    function resolveMarket(uint256 _marketId, bool _outcome) external onlyOwner {
        Market storage market = markets[_marketId];
        require(!market.resolved, "Market already resolved");
        require(!market.emergencyStopped, "Market is emergency stopped");

        market.resolved = true;
        market.outcome = _outcome;

        emit MarketResolved(_marketId, _outcome);
    }

    function emergencyStopMarket(uint256 _marketId) external onlyOwner {
        Market storage market = markets[_marketId];
        require(!market.resolved, "Market already resolved");
        require(!market.emergencyStopped, "Market already emergency stopped");

        market.emergencyStopped = true;

        emit EmergencyStop(_marketId);
    }

    function claimRewards(uint256 _marketId) external {
        Market storage market = markets[_marketId];
        require(market.resolved || market.emergencyStopped, "Market not resolved or emergency stopped");

        uint256 yesBalance = market.yesToken.balanceOf(msg.sender);
        uint256 noBalance = market.noToken.balanceOf(msg.sender);
        
        require(yesBalance > 0 || noBalance > 0, "No tokens to claim");

        uint256 reward;
        if (market.resolved) {
            uint256 winningBalance = market.outcome ? yesBalance : noBalance;
            uint256 totalReserve = market.reserve0 + market.reserve1;
            reward = (winningBalance * usdcToken.balanceOf(address(this))) / totalReserve;
        } else {
            // In case of emergency stop, return proportional USDC for both YES and NO tokens
            uint256 totalTokens = market.yesToken.totalSupply() + market.noToken.totalSupply();
            reward = ((yesBalance + noBalance) * usdcToken.balanceOf(address(this))) / totalTokens;
        }

        if (yesBalance > 0) {
            market.yesToken.burn(msg.sender, yesBalance);
        }
        if (noBalance > 0) {
            market.noToken.burn(msg.sender, noBalance);
        }
        
        usdcToken.transfer(msg.sender, reward);
    }

    function getMarketPrice(uint256 _marketId, bool isYes) public view returns (uint256) {
        Market storage market = markets[_marketId];
        return isYes ? 
            (market.reserve0 * SCALE) / (market.reserve0 + market.reserve1) : 
            (market.reserve1 * SCALE) / (market.reserve0 + market.reserve1);
    }
}