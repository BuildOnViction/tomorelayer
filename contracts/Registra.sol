/// @dev fixed pragma
pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;


contract Registra {
    struct relayer {
        bool activated;
    }

    mapping(address => relayer) RELAYERS;

    function setRelayers(address _addr, relayer memory _meta)
        public
        returns (relayer memory _relayer) {
        RELAYERS[_addr] = _meta;
        return RELAYERS[_addr];
    }

}
