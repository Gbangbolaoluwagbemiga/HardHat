// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import {PriceConverter} from "./PriceConverter.sol";

contract FundMe {
    using PriceConverter for uint256;
    uint256 public constant MINIMUM_USD = 5e18;
    address owner;
    address[] _funders;
    mapping(address funder => uint256 amount) public amountFunded;

    constructor() {
        owner = msg.sender;
    }

    function send() public payable {
        require(msg.value.getConversionRate() >= MINIMUM_USD, "Not enough Gas");
        if (amountFunded[msg.sender] == 0) {
            _funders.push(msg.sender);
        }
        amountFunded[msg.sender] += msg.value;
    }

    function funders() public view returns (address[] memory) {
        return _funders;
    }

    function getVersion() public view returns (uint256) {
        return
            AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306)
                .version();
    }

    function withdrawal(address payable _to) public onlyOwner(_to) {
        (bool success, ) = _to.call{value: address(this).balance}("");

        for (
            uint256 funderIndex;
            funderIndex < _funders.length;
            funderIndex++
        ) {
            address _funder = _funders[funderIndex];
            amountFunded[_funder] = 0;
        }
        _funders = new address[](0);
        require(success, "Transfer error");
    }

    modifier onlyOwner(address _to) {
        require(_to == owner, "can't withdraw, not owner of the contract");
        _;
    }

    receive() external payable {
        send();
    }

    fallback() external payable {
        send();
    }
}
