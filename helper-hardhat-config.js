const networkConfig = {
    5: {
        name: "Goerli",
        ethUsdPriceFeed: "0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419",
    },
}
const developmentChains = ["hardhat", "local"]
const DECIMALS = 8
const INITIAL_ANSWER = 200000000000
module.exports = {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
}