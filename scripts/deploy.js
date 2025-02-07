// import { ethers } from "hardhat";
const { ethers, run, network } = require("hardhat");

async function main() {
  try {
    const SimpleStorageFactory = await ethers.getContractFactory(
      "SimpleStorage"
    );
    const simpleStorage = await SimpleStorageFactory.deploy();
    console.log(`In progress...`);

    await simpleStorage.waitForDeployment();
    console.log(`Deployed Address is ${await simpleStorage.getAddress()}`);

    function replacer(key, value) {
      if (typeof value === "bigint") {
        return value.toString(); // Convert BigInt to string
      }
      return value;
    }

    let Network = JSON.stringify(network.config, replacer, 1);

    if (network.config.chainId === 11155111 && process.env.API_KEY) {
      console.log("Waiting for block confirmations...");
      await simpleStorage.deploymentTransaction().wait(6);
      await verify(await simpleStorage.getAddress(), []);
      console.log(`verified...`);
    }

    const currentValue = await simpleStorage.retrieve();
    console.log(`current value: ${currentValue}`);

    const setStore = await simpleStorage.store(1949);
    await setStore.wait(1);
    const updatedValue = await simpleStorage.retrieve();
    console.log(`updatedValue is ${updatedValue}`);

    const addPerson = await simpleStorage.addPerson("Oluwagbemiga", 17);
    console.log(`I am HIM: ${addPerson}`);

    // process.exit(0);
  } catch (error) {
    console.error(error);
    // process.exit(1);
  }
}

const verify = async (contractAddress, args) => {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!");
    } else {
      console.log(e);
    }
  }
};

main();
