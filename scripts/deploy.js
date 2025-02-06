// import { ethers } from "hardhat";
const { ethers } = require("hardhat");

async function main() {
  try {
    const SimpleStorageFactory = await ethers.getContractFactory(
      "SimpleStorage"
    );
    const simpleStorage = await SimpleStorageFactory.deploy();
    console.log(`In progress...`);

    await simpleStorage.waitForDeployment();
    console.log(`Deployed Address is ${await simpleStorage.getAddress()}`);

    // process.exit(0);
  } catch (error) {
    console.error(error);
    // process.exit(1);
  }
}

main();
