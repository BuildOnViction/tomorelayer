pragma solidity ^0.5.0;

contract StoreVar {

    address public owner;
    uint8 public _myVar;
    event MyEvent(uint indexed _var);

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Only owner!");
        _;
    }

    function setVar(uint8 _var) onlyOwner public returns (uint8) {
        _myVar = _var;
        emit MyEvent(_var);
    }

    function getVar() public view returns (uint8) {
        return _myVar;
    }

}
