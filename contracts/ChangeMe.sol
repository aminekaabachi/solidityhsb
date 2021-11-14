// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21;
pragma experimental ABIEncoderV2;

contract ChangeMe {
    address payable contractOwner;

    struct Update {
        string url;
        address owner;
        uint256 price;
        uint256 gasprice;
    }

    Update[] public updates;

    event UpdateURL(string url, uint256 price, address owner);

    constructor() public {
        Update memory state = Update("https://ethereum.org/en/", tx.origin, 0, tx.gasprice);
        updates.push(state);
        emit UpdateURL(state.url, state.price, state.owner);
        contractOwner = tx.origin;
    }

    function set(string memory newURL) public payable {
        Update memory state = updates[updates.length - 1];
        if (msg.value > state.price) {
            contractOwner.transfer(msg.value);
            updates.push(Update(newURL, tx.origin, msg.value, msg.gas));
            emit UpdateURL(state.url, state.price, state.owner);
        } else {
            revert('Not enough offer for price');
        }
    }

    function getCurrent() public view returns (Update memory) {
       return updates[updates.length - 1];
    }

    function getHistory() public view returns (Update[] memory) {
       return updates;
    }
}
