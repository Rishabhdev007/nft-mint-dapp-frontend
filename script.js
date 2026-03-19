let contract;
let userAddress;

const contractAddress = "0xB9b02D872ee406E66718A1C7fcB9F833EAD35f27";

const abi = [
  "function mintNFT() public returns (uint256)"
];

// 🔑 PUT YOUR ETHERSCAN API KEY HERE
const ETHERSCAN_API_KEY = "BCPHWVS8GVJFAY2YNV9ZSQCMPMSAPNP845";

// ✅ CONNECT WALLET
async function connectWallet() {
  if (!window.ethereum) {
    alert("MetaMask not detected");
    return;
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    userAddress = accounts[0];

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    contract = new ethers.Contract(contractAddress, abi, signer);

    document.getElementById("status").innerText = "Wallet Connected ✅";

    // Show full address
    document.getElementById("wallet").innerText =
      "Address: " + userAddress;

    // Load transactions
    loadTransactions();

  } catch (error) {
    console.error(error);
  }
}

// ✅ LOAD LAST 10 TX
async function loadTransactions() {
  const url = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${userAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const txList = document.getElementById("txList");
    txList.innerHTML = "";

    const txs = data.result.slice(0, 10);

    txs.forEach(tx => {
      const li = document.createElement("li");

      li.innerHTML = `
        <a href="https://sepolia.etherscan.io/tx/${tx.hash}" target="_blank">
          ${tx.hash.slice(0,10)}...
        </a>
      `;

      txList.appendChild(li);
    });

  } catch (err) {
    console.error(err);
  }
}

// ✅ MINT NFT
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

    // reload tx history
    loadTransactions();

  } catch (error) {
    console.error(error);
    document.getElementById("status").innerText = "Error ❌";
  }
}

// EVENTS
document.getElementById("connectBtn").onclick = connectWallet;
document.getElementById("mintBtn").onclick = mintNFT;
