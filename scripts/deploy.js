const hre = require("hardhat");

async function main() {
  console.log("Deploying TrachyCoin...");

  const trachyCoin = await hre.ethers.deployContract("TrachyCoin");
  await trachyCoin.waitForDeployment();

  console.log("TrachyCoin deployed to:", await trachyCoin.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 