let contract;
let userAddress;

const contractAddress = "0xB9b02D872ee406E66718A1C7fcB9F833EAD35f27";

const abi = [
  "function mintNFT() public returns (uint256)"
];

// 🔑 Your API key
const ETHERSCAN_API_KEY = "BCPHWVS8GVJFAY2YNV9ZSQCMPMSAPNP845";


// ===============================
// ✅ CONNECT WALLET
// ===============================
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

    // UI
    document.getElementById("status").innerText = "Wallet Connected ✅";

    document.getElementById("wallet").innerHTML = `
      <span style="background:#1e293b; padding:6px 10px; border-radius:8px;">
        🟢 ${userAddress.slice(0,6)}...${userAddress.slice(-4)}
      </span>
    `;

    // Load transactions
    loadTransactions();

  } catch (error) {
    console.error(error);
    document.getElementById("status").innerText = "Connection Failed ❌";
  }
}


// ===============================
// ✅ LOAD TRANSACTIONS
// ===============================
async function loadTransactions() {
  const txList = document.getElementById("txList");

  txList.innerHTML = "<li>Loading transactions...</li>";

  const url = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${userAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    txList.innerHTML = "";

    if (data.status !== "1") {
      txList.innerHTML = "<li>No transactions found</li>";
      return;
    }

    data.result.slice(0, 10).forEach((tx) => {
      const li = document.createElement("li");

      li.innerHTML = `
        <a href="https://sepolia.etherscan.io/tx/${tx.hash}" target="_blank">
          🔗 ${tx.hash.slice(0, 12)}...
        </a>
      `;

      txList.appendChild(li);
    });

  } catch (err) {
    console.error(err);
    txList.innerHTML = "<li>Error loading transactions ❌</li>";
  }
}


// ===============================
// ✅ MINT NFT
// ===============================
async function mintNFT() {
  if (!contract) {
    alert("Connect wallet first");
    return;
  }

  try {
    document.getElementById("status").innerText = "Minting... ⏳";

    const tx = await contract.mintNFT();

    document.getElementById("status").innerHTML = `
      Transaction Sent 🚀 <br>
      <a href="https://sepolia.etherscan.io/tx/${tx.hash}" target="_blank">
        🔗 View on Etherscan
      </a>
    `;

    await tx.wait();

    document.getElementById("status").innerHTML = `
      <div style="margin-top:10px; padding:12px; background:#0f172a; border-radius:10px;">
        <h3>🎉 NFT Minted Successfully</h3>
        <a href="https://sepolia.etherscan.io/tx/${tx.hash}" target="_blank">
          🔗 View Transaction
        </a>
      </div>
    `;

    // Refresh transactions after mint
    loadTransactions();

  } catch (error) {
    console.error(error);

    if (error.code === 4001) {
      document.getElementById("status").innerText = "User Rejected ❌";
    } else {
      document.getElementById("status").innerText = "Mint Failed ❌";
    }
  }
}


// ===============================
// ✅ AUTO CONNECT
// ===============================
window.addEventListener("load", async () => {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length > 0) {
        connectWallet();
      }
    } catch (err) {
      console.error(err);
    }
  }
});


// ===============================
// ✅ EVENTS
// ===============================
document.getElementById("connectBtn").onclick = connectWallet;
document.getElementById("mintBtn").onclick = mintNFT;
