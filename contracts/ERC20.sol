// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

contract REAL is ERC20 {

    address private owner;

    constructor() ERC20("Real", "BRT") {
        owner = msg.sender;
    }

    function mint(address _to, uint256 _amount) public {
        require(msg.sender == owner, "only owner");
        _mint(_to, _amount);
    }
}
