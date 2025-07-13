const hre = require("hardhat");

async function main() {
  console.log("Deploying TradingContract to Shardeum Testnet...");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Get the contract factory
  const TradingContract = await hre.ethers.getContractFactory("TradingContract");

  // Deploy the contract
  console.log("Deploying contract...");
  const tradingContract = await TradingContract.deploy();

  // Wait for deployment to complete
  await tradingContract.waitForDeployment();

  const contractAddress = await tradingContract.getAddress();
  console.log("TradingContract deployed to:", contractAddress);

  // Verify the deployment
  console.log("Verifying deployment...");
  const owner = await tradingContract.owner();
  console.log("Contract owner:", owner);
  console.log("Total trades:", await tradingContract.getTotalTrades());

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: contractAddress,
    deployer: deployer.address,
    blockNumber: await hre.ethers.provider.getBlockNumber(),
    timestamp: new Date().toISOString()
  };

  console.log("\n=== Deployment Summary ===");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // If on Shardeum testnet, provide explorer links
  if (hre.network.name === "shardeum_testnet") {
    console.log("\n=== Shardeum Explorer Links ===");
    console.log(`Contract: https://explorer-sphinx.shardeum.org/address/${contractAddress}`);
    console.log(`Deployer: https://explorer-sphinx.shardeum.org/address/${deployer.address}`);
  }

  return contractAddress;
}

// Execute deployment
main()
  .then((contractAddress) => {
    console.log(`\nDeployment completed successfully!`);
    console.log(`Contract address: ${contractAddress}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });