/// @dev fixed pragma
pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;


contract Official_TomoChain_Relayer_Registration {
    struct relayer {
        bool activated;
        uint16 dex_rate;
        uint16 foundation_rate;
    }

    mapping(address => relayer) RELAYERS;

    function register(address _addr, relayer memory _meta)
        public
        returns (relayer memory _relayer) {
        require(_meta.dex_rate < 100, "DEX_RATE must not be larger than 100 percent");
        RELAYERS[_addr] = _meta;
        return RELAYERS[_addr];
    }

}
