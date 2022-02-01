// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { Contract } from "ethers";
import { ethers, artifacts } from "hardhat";
import fs from "fs"
import path from "path"

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  if ((await ethers.getSigners()).length == 0) throw new Error("no accounts (set env PRIVATE_KEY)")
  const Arcades = await ethers.getContractFactory("Arcades");
  const ScrapToken = await ethers.getContractFactory("ScrapToken");

  const scrapToken = await ScrapToken.deploy();
  await scrapToken.deployed();

  const arcades = await Arcades.deploy(scrapToken.address);
  await arcades.deployed();

  await scrapToken.grantRole(await scrapToken.MINTER_ROLE(), arcades.address)
  saveArtifactFiles({ arcades, scrapToken })
}

function saveArtifactFiles(contracts: Record<string, Contract>) {
  console.log("saving artifacts");

  const contractsDir = path.join(__dirname, "..", "artifacts")

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  let addresses: Record<string, string> = {}
  Object.keys(contracts).map(function (name) {
    addresses[name] = contracts[name].address;
  });

  fs.writeFileSync(
    contractsDir + "/contract-addresses.json",
    JSON.stringify(addresses, undefined, 2)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
