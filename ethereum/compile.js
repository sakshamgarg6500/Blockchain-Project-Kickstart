const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

//we will compile only once

//delete the 'build' folder
const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

//read 'Campaign.sol' from 'contracts' folder
const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(campaignPath, "utf-8");

//compile both contracts with solidity compiler
const output = solc.compile(source, 1).contracts;
fs.ensureDirSync(buildPath); //create 'build' folder

for (let contract in output) {
	//output a file for each contract
	fs.outputJSONSync(
		path.resolve(buildPath, contract.replace(":", "") + ".json"),
		output[contract]
	);
}
