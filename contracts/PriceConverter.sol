// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    // cant send ether, and functions are only internal
    // address constant placholderaddy =
    //     0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419; //eth/usd link feed address

    function getPrice(
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        //ABI of contract
        //address of contract

        (, int256 price, , , ) = priceFeed.latestRoundData(); //this is price of eth in USD

        return uint256(price * 1e10);
    }

    // function getVersion() internal view returns (uint256) {
    //     AggregatorV3Interface priceFeed = AggregatorV3Interface(placholderaddy);
    //     return priceFeed.version();
    // }

    function getConversionRate(
        uint256 ethAmount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        uint256 ethPrice = getPrice(priceFeed);
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18; //calculate eth
        return ethAmountInUsd;
    }
}
