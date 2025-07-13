// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title TradingContract
 * @dev A simple contract to record trading activities on Shardeum
 * This contract can be deployed on Shardeum Testnet or Ethereum networks
 */
contract TradingContract {
    struct Trade {
        address user;
        string symbol;
        uint256 amount;
        uint256 price;
        bool isBuy; // true for buy, false for sell
        uint256 timestamp;
    }

    struct UserStats {
        uint256 totalTrades;
        uint256 totalVolume;
        uint256 shmTokens;
    }

    // Events
    event TradeRecorded(
        address indexed user,
        string symbol,
        uint256 amount,
        uint256 price,
        bool isBuy,
        uint256 timestamp
    );

    event TokensRewarded(
        address indexed user,
        uint256 amount,
        string reason
    );

    // State variables
    mapping(address => Trade[]) public userTrades;
    mapping(address => UserStats) public userStats;
    Trade[] public allTrades;
    address public owner;
    uint256 public totalTrades;

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
        totalTrades = 0;
    }

    /**
     * @dev Record a new trade
     * @param symbol The trading symbol (e.g., "BTC", "ETH")
     * @param amount The amount traded
     * @param price The price at which the trade was executed
     * @param isBuy Whether this is a buy (true) or sell (false) order
     */
    function recordTrade(
        string memory symbol,
        uint256 amount,
        uint256 price,
        bool isBuy
    ) public {
        Trade memory newTrade = Trade({
            user: msg.sender,
            symbol: symbol,
            amount: amount,
            price: price,
            isBuy: isBuy,
            timestamp: block.timestamp
        });

        userTrades[msg.sender].push(newTrade);
        allTrades.push(newTrade);
        
        // Update user stats
        userStats[msg.sender].totalTrades++;
        userStats[msg.sender].totalVolume += (amount * price) / 1e18;
        
        totalTrades++;

        emit TradeRecorded(
            msg.sender,
            symbol,
            amount,
            price,
            isBuy,
            block.timestamp
        );
    }

    /**
     * @dev Reward SHM tokens to a user (for correct predictions)
     * @param user The user to reward
     * @param amount The amount of tokens to reward
     * @param reason The reason for the reward
     */
    function rewardTokens(
        address user,
        uint256 amount,
        string memory reason
    ) public onlyOwner {
        userStats[user].shmTokens += amount;
        
        emit TokensRewarded(user, amount, reason);
    }

    /**
     * @dev Get all trades for a specific user
     * @param user The user address
     * @return Array of trades for the user
     */
    function getUserTrades(address user) public view returns (Trade[] memory) {
        return userTrades[user];
    }

    /**
     * @dev Get user statistics
     * @param user The user address
     * @return UserStats struct with user's trading statistics
     */
    function getUserStats(address user) public view returns (UserStats memory) {
        return userStats[user];
    }

    /**
     * @dev Get the latest N trades across all users
     * @param count Number of recent trades to return
     * @return Array of recent trades
     */
    function getRecentTrades(uint256 count) public view returns (Trade[] memory) {
        require(count <= totalTrades, "Count exceeds total trades");
        
        Trade[] memory recentTrades = new Trade[](count);
        uint256 startIndex = totalTrades - count;
        
        for (uint256 i = 0; i < count; i++) {
            recentTrades[i] = allTrades[startIndex + i];
        }
        
        return recentTrades;
    }

    /**
     * @dev Get total number of trades
     * @return Total number of trades recorded
     */
    function getTotalTrades() public view returns (uint256) {
        return totalTrades;
    }

    /**
     * @dev Get contract balance (for admin purposes)
     * @return Contract balance in wei
     */
    function getContractBalance() public view onlyOwner returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Withdraw contract balance (for admin purposes)
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    /**
     * @dev Transfer ownership of the contract
     * @param newOwner The new owner address
     */
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        owner = newOwner;
    }

    // Fallback function to receive Ether
    receive() external payable {}
}