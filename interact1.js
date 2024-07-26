const { Web3 } = require("web3");
const path = require("path");
const fs = require("fs");

const web3 = new Web3("http://127.0.0.1:8545/");

// Read the contract address from the file system
const deployedAddressPath = path.join(__dirname, "MyVotingContractAddress.txt");
const deployedAddress = fs.readFileSync(deployedAddressPath, "utf8");

// Create a new contract object using the ABI and address
const abi = require("./MyVotingContractAbi.json");
const simpleVotingContract = new web3.eth.Contract(abi, deployedAddress);
simpleVotingContract.handleRevert = true;

async function interact() {
  const accounts = await web3.eth.getAccounts();
  const defaultAccount = accounts[0];

  try {
    // Get the list of candidates
    const candidates = await simpleVotingContract.methods
      .getCandidates()
      .call();
    console.log("Candidates: " + candidates.join(", "));

    // Example candidate to vote for
    const candidateToVote = candidates[0]; // Change this to any candidate name you want to vote for

    // Cast a vote for the selected candidate
    const receipt = await simpleVotingContract.methods
      .voteForCandidate(candidateToVote)
      .send({
        from: defaultAccount,
        gas: 1000000,
        gasPrice: "10000000000",
      });
    console.log("Transaction Hash: " + receipt.transactionHash);

    // Get the total votes for the selected candidate
    const votes = await simpleVotingContract.methods
      .totalVotesFor(candidateToVote)
      .call();
    console.log("Total votes for " + candidateToVote + ": " + votes);
  } catch (error) {
    console.error(error);
  }
}

interact();
