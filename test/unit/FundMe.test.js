const { assert, expect } = require("chai");
const { deployments, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe('FundMe', async function () {

        let fundMe
        let deployer
        let mockV3Aggregator
        const sendValue = ethers.utils.parseEther('1')
        beforeEach(async function () {
            deployer = (await getNamedAccounts()).deployer
            await deployments.fixture(['all'])
            fundMe = await ethers.getContract("FundMe", deployer)
            mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer)
        })
        describe('constructor', async function () {
            it('sets an aggregator addresses correctly', async function () {
                const response = await fundMe.getPriceFeed()
                assert.equal(response, mockV3Aggregator.address)
            });
        });


        describe('fund', async function () {
            it('fails if enough eth not sent', async function () {
                await expect(fundMe.fund()).to.be.revertedWith("You need to send more eth")
            });
            it('updated the amount funded data structure', async function () {
                await fundMe.fund({ value: sendValue })
                const response = await fundMe.getAddressToAmountFunded(deployer)
                assert.equal(response.toString(), sendValue.toString())
            });
            it('adds getFunder to getFunder array', async function () {
                await fundMe.fund({ value: sendValue })
                const response = await fundMe.getFunder(0)
                assert.equal(response, deployer)
            });
        });

        describe('withdraw', async function () {
            // run a starting fund()
            beforeEach(async function () {
                await fundMe.fund({ value: sendValue })

            });
            it('withdraw eth from a single funder', async function () {
                //
                const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)

                const startingDeployerBalance = await fundMe.provider.getBalance(deployer)

                const transactionResponse = await fundMe.withdraw()

                const transactionReciept = await transactionResponse.wait(1)


                const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
                const endingDeployerBalance = await fundMe.provider.getBalance(deployer)

                //Get gasCost
                const { gasUsed, effectiveGasPrice } = transactionReciept
                const gasCost = gasUsed.mul(effectiveGasPrice)

                assert.equal(endingFundMeBalance, 0)
                assert.equal(startingFundMeBalance.add(startingDeployerBalance.toString()), endingDeployerBalance.add(gasCost).toString())
            });

            it('cheaper withdraw eth from a single funder', async function () {
                //
                const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)

                const startingDeployerBalance = await fundMe.provider.getBalance(deployer)

                const transactionResponse = await fundMe.cheapWithdraw()

                const transactionReciept = await transactionResponse.wait(1)


                const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
                const endingDeployerBalance = await fundMe.provider.getBalance(deployer)

                //Get gasCost
                const { gasUsed, effectiveGasPrice } = transactionReciept
                const gasCost = gasUsed.mul(effectiveGasPrice)

                assert.equal(endingFundMeBalance, 0)
                assert.equal(startingFundMeBalance.add(startingDeployerBalance.toString()), endingDeployerBalance.add(gasCost).toString())
            });
            it('withdraw eth from a multiple getFunder', async function () {
                //
                const accounts = await ethers.getSigners()

                for (let i = 0; i < 6; i++) {
                    const fundMeConnectedContract = await fundMe.connect(accounts[i])
                    await fundMeConnectedContract.fund({ value: sendValue }) //absence of await fucked up the test pheew!
                }

                const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)

                const startingDeployerBalance = await fundMe.provider.getBalance(deployer)



                const transactionResponse = await fundMe.withdraw()

                const transactionReciept = await transactionResponse.wait(1)

                const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
                const endingDeployerBalance = await fundMe.provider.getBalance(deployer)

                //Get gasCost
                const { gasUsed, effectiveGasPrice } = transactionReciept
                const gasCost = gasUsed.mul(effectiveGasPrice)

                assert.equal(endingFundMeBalance, 0)
                assert.equal(startingFundMeBalance.add(startingDeployerBalance.toString()), endingDeployerBalance.add(gasCost).toString())
                //reset getFunder array properly
                await expect(fundMe.getFunder(0)).to.be.reverted

                for (let i = 0; i < 6; i++) {
                    assert.equal(await fundMe.getAddressToAmountFunded(accounts[i].address), 0)

                }
            });
            it('Only allows owner to withdraw', async function () {
                const accounts = await ethers.getSigners()  //await wahala again
                const attackerConnectedContract = await fundMe.connect(accounts[1])
                await expect(attackerConnectedContract.withdraw()).to.be.reverted
            });

        });




    });

