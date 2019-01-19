/// @dev fixed pragma
pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

/// NOTE: upgradable contract?
contract Official_TomoChain_Relayer_Registration {
    /// NOTE: rate in range(0, 100)
    struct relayer {
        bool activated;
        bool registered;
        uint16 dex_rate;
        uint16 foundation_rate;
    }

    mapping(address => relayer) RELAYERS;


    /// MODIFIERS
    modifier rateIsValid(relayer memory _relayer) {
        require(_relayer.dex_rate < 100, "DEX_RATE must not be larger than 100 percent");
        require(_relayer.dex_rate >= 0, "DEX_RATE must not be less than 0");
        require(_relayer.foundation_rate < 100, "FOUNDATION_RATE must not be larger than 100 percent");
        require(_relayer.foundation_rate >= 0, "FOUNDATION_RATE must not be less than 0");
        _;
    }


    /// LOGIC
    function register(address _addr, relayer memory _relayer)
        public
        rateIsValid(_relayer)
        returns (bool success, relayer memory registeredRelayer)
    {
        require(!RELAYERS[_addr].registered, "Address is already registered!");

        RELAYERS[_addr] = _relayer;
        RELAYERS[_addr].registered = true;

        return (true, RELAYERS[_addr]);
    }

    function updateRelayer(address _addr, relayer memory _relayer)
        public
        rateIsValid(_relayer)
        returns (bool success, relayer memory updatedRelayer)
    {
        require(RELAYERS[_addr].registered, "Address is not registered!");
        require(_relayer.registered, "Registration status is not mutable!");

        RELAYERS[_addr] = _relayer;

        return (true, RELAYERS[_addr]);
    }

}
