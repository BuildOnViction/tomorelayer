pragma solidity 0.4.24;

import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-solidity/v1.12.0/contracts/token/ERC20/ERC20.sol";
import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-solidity/v1.12.0/contracts/token/ERC20/DetailedERC20.sol";
import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-solidity/v1.12.0/contracts/token/ERC20/CappedToken.sol";

/// @dev this ERC20 contract is used for creating Test-Tokens only
contract Token is ERC20, DetailedERC20, CappedToken {
    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint256 _cap)
        ERC20()
        DetailedERC20(_name, _symbol, _decimals)
        CappedToken(_cap)
        public {
            mint(msg.sender, _cap * 10 / 100);
    }
}
