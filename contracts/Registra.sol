/// @dev fixed pragma
pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;


contract Registra {
    enum LEVEL { STARTER, COLLABORATOR, PARTNERSHIP, FOUNDATION }

    struct relayer {
        uint256 dex_rate;
        uint256 foundation_rate;
        bool activated;
        LEVEL level;
    }

    mapping(address => relayer) RELAYERS;

    function setRelayers(address _addr, relayer memory _meta)
        public
        returns (bool _pristine, relayer memory _relayer) {
        bool pristine = RELAYERS[_addr].dex_rate == 0;
        RELAYERS[_addr] = _meta;
        return (pristine, RELAYERS[_addr]);
    }

}
