const { ethers, getNamedAccounts } = require("hardhat")
// const run=require("run")



//async main
async function main() {
    const { deployer } = await getNamedAccounts()

    fundMe = await ethers.getContract("FundMe", deployer)
    console.log("Funding")
    const res = await fundMe.fund({ value: ethers.utils.parseEther("0.1") })
    await res.wait(1)
    console.log("Funded")
}

// main()
main().then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })