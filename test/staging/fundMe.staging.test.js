//last test 
const { assert } = require("chai");
const { ethers, getNamedAccounts, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe('FundMe', async function () {
        let fundMe
        let deployer
        const sendValue = ethers.utils.parseEther('1')
        beforeEach(async function () {
            deployer = (await getNamedAccounts()).deployer
            fundMe = await ethers.getContract("FundMe", deployer)
        })

        it('allows people to fund and withdraw ', async function () {
            console.log('h')
            await fundMe.fund({ value: sendValue })
            console.log('h1')
            await fundMe.withdraw()
            const endingBalance = await fundMe.provider.getBalance(fundMe.address)
            console.log('h2')
            assert.equal(endingBalance.toString(), "0")
        });



    });

