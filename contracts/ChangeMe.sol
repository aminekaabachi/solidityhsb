// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;

contract ChangeMe {
    address payable contractOwner;

    struct Update {
        string url;
        address owner;
        uint256 price;
        uint256 gasprice;
    }

    Update public state;

    event UpdateURL(string url, uint256 price, address owner);

    constructor() public {
        state = Update("https://ethereum.org/en/", tx.origin, 0, tx.gasprice);
        emit UpdateURL(state.url, state.price, state.owner);
        contractOwner = tx.origin;
    }

    function set(string memory newURL) public payable {
        if (msg.value > state.price) {
            contractOwner.transfer(msg.value);
            state = Update(newURL, tx.origin, msg.value, tx.gasprice);
            emit UpdateURL(state.url, state.price, state.owner);
        } else {
            revert();
        }
    }

    function getURL() public view returns (string memory url) {
        return state.url;
    }

    function getPrice() public view returns (uint256 price) {
        return state.price;
    }

    function getOwner() public view returns (address owner) {
        return state.owner;
    }

    function getGasPrice() public view returns (uint256 gasprice) {
        return state.gasprice;
    }
}
