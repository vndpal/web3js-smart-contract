const { Web3 } = require("web3");
const path = require("path");
const fs = require("fs");

const web3 = new Web3("http://127.0.0.1:8545/");

const bytecodePath = path.join(__dirname, "MyVotingContractBytecode.bin");
const bytecode = fs.readFileSync(bytecodePath, "utf8");

const abi = require("./MyVotingContractAbi.json");
const simpleVotingContract = new web3.eth.Contract(abi);
simpleVotingContract.handleRevert = true;

async function deploy() {
  const accounts = await web3.eth.getAccounts();
  const defaultAccount = accounts[0];
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
    fs.writeFileSync(deployedAddressPath, tx.options.address);
  } catch (error) {
    console.error(error);
  }
}

deploy();
