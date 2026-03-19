let contract;

const contractAddress = "0xB9b02D872ee406E66718A1C7fcB9F833EAD35f27";

const abi = [
  "function mintNFT() public returns (uint256)"
];

// ✅ CONNECT WALLET
async function connectWallet() {
  if (typeof window.ethereum === "undefined") {
    alert("MetaMask not detected");
    return;
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    contract = new ethers.Contract(contractAddress, abi, signer);

    const shortAddress =
      accounts[0].slice(0, 6) + "..." + accounts[0].slice(-4);

    document.getElementById("status").innerText =
      "Connected: " + shortAddress + " ✅";

  } catch (error) {
    console.error(error);
    document.getElementById("status").innerText =
      "Connection Failed ❌";
  }
}

// ✅ MINT NFT
async function mintNFT() {
  if (!contract) {
    alert("Connect wallet first");
    return;
  }

  try {
    document.getElementById("status").innerText =
      "Minting NFT... ⏳";

    const tx = await contract.mintNFT();

    document.getElementById("status").innerHTML =
      `Transaction Sent 🚀 <br>
       <a href="https://sepolia.etherscan.io/tx/${tx.hash}" target="_blank">
       View on Etherscan
       </a>`;

    await tx.wait();

    document.getElementById("status").innerHTML =
      `NFT Minted Successfully 🎉 <br>
       <a href="https://sepolia.etherscan.io/tx/${tx.hash}" target="_blank">
       View Transaction
       </a>`;

  } catch (error) {
    console.error(error);

    if (error.code === 4001) {
      document.getElementById("status").innerText =
        "Transaction Rejected ❌";
    } else {
      document.getElementById("status").innerText =
        "Error Minting NFT ❌";
    }
  }
}

// ✅ BUTTON EVENTS
document.getElementById("connectBtn").onclick = connectWallet;
document.getElementById("mintBtn").onclick = mintNFT;
