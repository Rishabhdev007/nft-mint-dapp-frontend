let contract;

const contractAddress = "0xB9b02D872ee406E66718A1C7fcB9F833EAD35f27";

const abi = [
  "function mintNFT() public returns (uint256)"
];

async function connectWallet() {
  if (!window.ethereum) {
    alert("Install MetaMask");
    return;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);

  const signer = provider.getSigner();

  contract = new ethers.Contract(contractAddress, abi, signer);

  document.getElementById("status").innerText = "Wallet Connected ✅";
}

async function mintNFT() {
  if (!contract) {
    alert("Connect wallet first");
    return;
  }

  try {
    document.getElementById("status").innerText = "Minting... ⏳";

    const tx = await contract.mintNFT();
    await tx.wait();

    document.getElementById("status").innerText = "NFT Minted 🎉";
  } catch (error) {
    console.error(error);
    document.getElementById("status").innerText = "Error ❌";
  }
}

document.getElementById("connectBtn").onclick = connectWallet;
document.getElementById("mintBtn").onclick = mintNFT;