/// @dev fixed pragma
pragma solidity ^0.5.0;


/// NOTE: upgradable contract?
contract Registration {
    address public owner;

    /// NOTE: rate in range(0, 100)
    struct relayer {
        bool activated;
        bool registered;
        uint16 dex_rate;
        uint16 foundation_rate;
    }

    mapping(address => relayer) RELAYERS;

    constructor() public {
        owner = msg.sender;
    }


    /// EVENTS
    event NewRelayer (address relayer, uint16 dex_rate, uint16 foundation_rate);
    event UpdateRelayer (address relayer, bool activated, uint16 dex_rate, uint16 foundation_rate);


    /// MODIFIERS
    modifier onlyOwner {
        require(msg.sender == owner, "Only contract owner is allowed!");
        _;
    }

    modifier rateIsValid(uint16 dex_rate, uint16 foundation_rate) {
        require(dex_rate < 100, "DEX_RATE must not be larger than 100 percent");
        require(dex_rate >= 0, "DEX_RATE must not be less than 0");
        require(foundation_rate < 100, "FOUNDATION_RATE must not be larger than 100 percent");
        require(foundation_rate >= 0, "FOUNDATION_RATE must not be less than 0");
        _;
    }


    /// LOGIC
    function register(uint16 _dex_rate, uint16 _foundation_rate)
        public
        rateIsValid(_dex_rate, _foundation_rate)
    {
        require(!RELAYERS[msg.sender].registered, "Address is already registered!");
        address sender = msg.sender;
        RELAYERS[sender].dex_rate = _dex_rate;
        RELAYERS[sender].foundation_rate = _foundation_rate;
        RELAYERS[sender].activated = true;
        RELAYERS[sender].registered = true;

        emit NewRelayer(sender, RELAYERS[sender].dex_rate, RELAYERS[sender].foundation_rate);
    }

    function updateRelayer(address _addr, bool _activated, uint16 _dex_rate, uint16 _foundation_rate)
        public
        onlyOwner
        rateIsValid(_dex_rate, _foundation_rate)
    {
        require(RELAYERS[_addr].registered, "Address is not registered!");

        RELAYERS[_addr].dex_rate = _dex_rate;
        RELAYERS[_addr].foundation_rate = _foundation_rate;
        RELAYERS[_addr].activated = _activated;

        emit UpdateRelayer(_addr, RELAYERS[_addr].activated, RELAYERS[_addr].dex_rate, RELAYERS[_addr].foundation_rate);
    }

    function getSingleRelayer(address _addr)
        public
        view
        returns (bool _registered, bool _activated, uint16 _dex_rate, uint16 _foundation_rate)
    {
        bool registered = RELAYERS[_addr].registered;
        bool activated = RELAYERS[_addr].activated;
        uint16 dex_rate = RELAYERS[_addr].dex_rate;
        uint16 foundation_rate = RELAYERS[_addr].foundation_rate;

        return (registered, activated, dex_rate, foundation_rate);
    }

}
