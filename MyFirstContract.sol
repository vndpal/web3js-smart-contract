// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyFirstContract {
  uint256 public myNumber;

  constructor(uint256 _myNumber) {
    myNumber = _myNumber;
  }

  function setMyNumber(uint256 _myNumber) public {
    myNumber = _myNumber;
  }
}