// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

contract DREX is ERC20 {

    address private owner;
    constructor() ERC20("Real", "BRT")  { 
        owner = msg.sender;
    }

    function deposit(address _to, uint256 _amount) public  {
        require(msg.sender == owner, "only owner");
        _mint(_to, _amount);
    }

    function withdraw(uint _amount) public { //public onlyOwner {
        require(msg.sender == owner, "only owner");
        require(balanceOf(msg.sender) >= _amount);
        
        _burn(msg.sender, _amount);
        
        payable(msg.sender).transfer(_amount);
    }
    
}
