// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

// get funds
// withdraw funds
// set a minimum funding value in usd
import "./PriceConverter.sol";

// Error Codes
error FundMe__NotOwner();

/**
 * @title A contract for crowd funding
 * @author Sampel
 * @notice This contract is a demo crowd fund
 * */

contract FundMe {
    //Type declearations
    using PriceConverter for uint256;

    // state variables
    uint256 public constant MINIMUM_USD = 50 * 1e18;
    address[] private s_funders;
    mapping(address => uint256) private s_addressToAmountFunded;

    //Modifiers
    modifier onlyOwner() {
        //  _;//this says run code first then require
        // require(msg.sender==i_owner,"sender is not owner");//replace with custom errors
        if (msg.sender != i_owner) {
            revert FundMe__NotOwner();
        }
        _; //this says run require first then code
    }
    // Functions
    // Constructors
    address private immutable i_owner;
    AggregatorV3Interface private s_priceFeed;

    constructor(address priceFeedAddress) {
        //called immediately on call of contract
        i_owner = msg.sender; //owner is the person that deploys the contract
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    // Recieves and Fallbacks
    //recieve
    receive() external payable {
        fund();
    }

    //fallback
    fallback() external payable {
        fund();
    }

    /**
     *  @notice Handles funding of the contract
     *  @dev Uses the price feed as library
     * */
    function fund() public payable {
        //any function that allows sending eth
        // 1 set min fund amount in usd
        // 2 how to send eth to this contract
        //To work this and convert eth to USD we need to create an oracle and chainlink(external computation)
        require(
            msg.value.getConversionRate(s_priceFeed) > MINIMUM_USD,
            "You need to send more eth"
        );
        s_funders.push(msg.sender);
        s_addressToAmountFunded[msg.sender] += msg.value;
    }

    /**
     *  @notice Enable withdrawal by the contract owner
     *  @dev Only owner modifier used
     * */

    function withdraw() public onlyOwner {
        //We loop through the address of the funders map to resset the anunt funded to zero
        for (
            uint256 funderIndex = 0;
            funderIndex < s_funders.length;
            funderIndex = funderIndex + 1
        ) {
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        // reset array

        s_funders = new address[](0); // resets the funder array
        // withdraw funds
        // transfer
        // send
        // call

        // payable(msg.sender).transfer(address(this).balance); //reverrts transaction if it fails
        // send and call do not revert automatucally
        // bool success=payable(msg.sender).send(address(this).balance);
        // require(success, "Send failed");

        (bool callSucess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSucess, "Call failed");
    }

    function cheapWithdraw() public payable onlyOwner {
        //We loop through the address of the funders map to resset the anunt funded to zero
        address[] memory funders = s_funders;

        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex = funderIndex + 1
        ) {
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        // reset array

        s_funders = new address[](0); // resets the funder array
        // withdraw funds
        // transfer
        // send
        // call

        // payable(msg.sender).transfer(address(this).balance); //reverrts transaction if it fails
        // send and call do not revert automatucally
        // bool success=payable(msg.sender).send(address(this).balance);
        // require(success, "Send failed");

        (bool callSuccess, ) = i_owner.call{value: address(this).balance}("");
        require(callSuccess, "Call failed");
    }

    //View and pure
    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunder(uint256 funderIndex) public view returns (address) {
        return s_funders[funderIndex];
    }

    function getAddressToAmountFunded(
        address funder
    ) public view returns (uint256) {
        return s_addressToAmountFunded[funder];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}
