// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract ChangeMe {
  string public url = "https://ethereum.org/en/";
  uint public price = 0;

  function set(string memory x, uint amount) public {
    if (amount > price) {
      url = x;
      price = amount;
    }
  }

  function get() public view returns (string memory link, uint amount) {
    return (url, price);
  }
  
}
