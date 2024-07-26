const { Web3 } = require("web3");
const path = require("path");
const fs = require("fs");
const abi = require("./MyVotingContractAbi.json"); // Importing the ABI (Application Binary Interface) for the contract

const web3 = new Web3("http://127.0.0.1:8545/"); // Creating a new instance of Web3 and connecting to the local Ethereum node

const bytecodePath = path.join(__dirname, "MyVotingContractBytecode.bin"); // Path to the bytecode file
const bytecode = fs.readFileSync(bytecodePath, "utf8"); // Reading the bytecode from the file

const simpleVotingContract = new web3.eth.Contract(abi); // Creating a new instance of the contract using the ABI
simpleVotingContract.handleRevert = true; // Setting the handleRevert property to true to handle revert errors

async function deploy() {
  const accounts = await web3.eth.getAccounts(); // Getting the list of accounts
  const defaultAccount = accounts[0]; // Selecting the first account as the deployer account
  console.log("Deployer account:", defaultAccount);

  const contractDeployer = simpleVotingContract.deploy({
    data: "0x" + bytecode,
    arguments: [["Candidate1", "Candidate2", "Candidate3"]], // Example candidates
  });

  const gas = await contractDeployer.estimateGas({
    from: defaultAccount,
  });
  console.log("Estimated gas:", gas);

  try {
    const tx = await contractDeployer.send({
      from: defaultAccount,
      gas,
      gasPrice: "10000000000",
    });
    console.log("Contract deployed at address: " + tx.options.address);

    const deployedAddressPath = path.join(
      __dirname,
      "MyVotingContractAddress.txt"
    );
    fs.writeFileSync(deployedAddressPath, tx.options.address); // Writing the deployed contract address to a file
  } catch (error) {
    console.error(error);
  }
}

deploy();
