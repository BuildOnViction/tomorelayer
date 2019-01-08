/// @dev fixed pragma
pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract Cookie {
    // Game Host
    address payable HostAddress = 0x77e725d8D66846B44801C044EE6f9c416a694bfE;
    uint256 internal HostUnallocatedBalance = 0;

    struct GamePot { uint256 player; uint256 host; bool potLocked; }
    mapping(address => GamePot) Book;

    event Deposit (address _player, uint256 _bet);
    event PotLocked ();

    // MODIFIERS
    modifier viableDeposit() {
        if (msg.sender == HostAddress) {
            require(msg.value >= 2 ether, "Minimum deposit for game-host is 2 Ether");
        } else {
            require(msg.value >= 1 ether, "Minimum deposit for game-player is 1 Ether");
            require(msg.value <= (HostUnallocatedBalance / 2), "Host doesnt have enough ETH left to take this bet");
        }
        _;
    }

    /*
     * Features & Functions
     */
    function () payable external viableDeposit() {
        /* Game Pot: accept bet-ins and return rewards
         * Player's balance must be less than the current Host's unallocated half-balance
         * Players can deposit only and if only HostUnallocatedBalance in Pot > 0
         */

        if (msg.sender == HostAddress) {
            HostUnallocatedBalance = msg.value;
        } else {

            if (Book[msg.sender].player == 0) {
                Book[msg.sender] = GamePot(0, 0, false);
            }

            require(!Book[msg.sender].potLocked, "Pot must be open first");

            Book[msg.sender].player += msg.value;
            Book[msg.sender].host += msg.value;
            HostUnallocatedBalance -= msg.value;

            emit Deposit(msg.sender, msg.value);
        }
    }

    function lockingPot(address _player) external {
        require(Book[_player].player > 0 && Book[_player].host > 0, "Cannot lock empty Pot");
        Book[_player].potLocked = true;
    }

    function unlockingPot(address _player) external {
        require(Book[_player].potLocked, "Cannot unlock open Pot");
        Book[_player].potLocked = false;
    }

    function potQuery(address player) external view returns (uint256 pot) {
        return Book[player].player + Book[player].host;
    }

    function resolveGame(address payable player, bool playerWin) external {
        require(Book[player].potLocked, "Pot doesnt have enough bet from both parties");
        uint256 pot = Book[player].player + Book[player].host;
        Book[player] = GamePot(0, 0, false);

        if (playerWin) {
            address(player).transfer(pot);
        } else {
            address(HostAddress).transfer(pot);
        }
    }
}
