import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectBtn = document.getElementById("connectBtn")
const fundBtn = document.getElementById("fundBtn")

connectBtn.onclick = connect
fundBtn.onclick = fund
balanceBtn.onclick = getBalance
withdrawBtn.onclick = withdraw
async function connect() {
    if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        console.log('connected')
        connectBtn.innerHTML = "Connected"
    } else {
        connectBtn.innerHTML = "Please Connect Wallet"

    }
}

async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`funding with ${ethAmount}`)
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        console.log(signer)

        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const res = await contract.fund({ value: ethers.utils.parseEther(ethAmount) })
            console.log(`funded with ${ethAmount}`)
            await listeForTransactionMine(res, provider)
            console.log("Dones")
        } catch (error) {
            console.log(error)
        }

    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}`)
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReciept) => {
            console.log(`completed with ${transactionReciept.confirmation} confirmations`)
            resolve()
        })
    })
}
async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)

        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const res = await contract.withdraw()
            // console.log(`funded with ${ethAmount}`)
            await listeForTransactionMine(res, provider)

        } catch (error) {
            console.log(error)
        }
    }
}



async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))

    }
}

