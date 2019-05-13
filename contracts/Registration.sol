pragma solidity >=0.4.22 <0.6.0;
pragma experimental ABIEncoderV2;

contract RelayerRegistration {

    /// @dev constructor arguments
    address public OWNER;
    uint public MaximumRelayers;
    uint public MaximumTokenList;


    /// @dev Data types
    struct Relayer {
        address _coinbase;
        uint256 _deposit;
        uint16 _makerFee;
        uint16 _takerFee;
        address[] _fromTokens;
        address[] _toTokens;
    }

    struct RelayerOwnership {
        address _coinbase;
        address _owner;
    }

    /// @dev owner -> name -> relayer
    mapping(address => mapping(string => Relayer)) private RELAYER_OWNER_LIST;
    mapping(address => string[]) private RELAYER_NAME_LIST;
    /// @dev name -> { owner, coinbase }
    mapping(string => RelayerOwnership) private RELAYER_OWNERSHIP_LIST;
    /// @dev coinbase -> name
    mapping(address => string) private RELAYER_COINBASE_LIST;
    /// @dev name -> time
    mapping(string => uint) private RESIGN_REQUESTS;

    uint public RelayerCount;
    uint256 public MinimumDeposit  = 25000 ether;

    /// @dev Events
    event ConfigEvent(uint max_relayer, uint max_token, uint256 min_deposit);
    event RegisterEvent(string relayer_name, address coinbase, string[] names);
    event UpdateEvent(string relayer_name, uint256 deposit);
    event ChangeOwnershipEvent(string relayer_name, address new_owner, address new_coinbase);
    event ResignEvent(uint deposit_release_time, uint256 deposit_amount);
    event RefundEvent(bool success, uint remaining_time, uint256 deposit_amount);

    constructor (uint maxRelayers) public {
        RelayerCount = 0;
        MaximumRelayers = maxRelayers;
        MaximumTokenList = 200;
        OWNER = msg.sender;
    }


    /// @dev Modifier
    modifier contractOwnerOnly() {
        require(msg.sender == OWNER, "Contract Owner Only.");
        _;
    }

    modifier relayerOwnerOnly(string memory relayerName) {
        require(RELAYER_OWNERSHIP_LIST[relayerName]._owner == msg.sender, "Unauthorized request.");
        _;
    }

    modifier onlyActiveRelayer(string memory relayerName) {
        require(RESIGN_REQUESTS[relayerName] == 0, "The relayer has been requested to close.");
        _;
    }

    modifier nonZeroValue() {
        require(msg.value > 0, "Transfer value must be > 0");
        _;
    }


    /// @dev Contract Config Modifications
    function reconfigure (uint maxRelayer, uint maxToken, uint256 minDeposit) public contractOwnerOnly {
        require(maxRelayer > RelayerCount);
        require(maxToken > 4 && maxToken < 1001);
        require(minDeposit > 10000);
        MaximumRelayers = maxRelayer;
        MaximumTokenList = maxToken;
        MinimumDeposit = minDeposit;
        emit ConfigEvent(MaximumRelayers,MaximumTokenList, MinimumDeposit);
    }


    /// @dev State-Alter Methods
    function register
        (
         address coinbase,
         string memory name,
         uint16 makerFee,
         uint16 takerFee,
         address[] memory fromTokens,
         address[] memory toTokens
         )
        public
        payable
    {
        require(msg.sender != OWNER, "Contract Owner is forbidden to create a Relayer");
        require(msg.value >= MinimumDeposit, "Minimum deposit not satisfied.");
        /// @dev valid relayer configuration
        require(bytes(name).length >= 3 && bytes(name).length <= 32, "Name length invalid (3 ~ 32)");
        require(makerFee >= 1 && makerFee < 1000, "Invalid Maker Fee");
        require(takerFee >= 1 && takerFee < 1000, "Invalid Taker Fee");
        require(fromTokens.length <= MaximumTokenList, "Exceeding number of trade pairs");
        require(toTokens.length == fromTokens.length, "Not valid number of Pairs");
        /// @dev uniqueness assurance to avoid double-spending
        require(bytes(RELAYER_COINBASE_LIST[coinbase]).length == 0, "Coinbase already registered.");
        require(RELAYER_OWNERSHIP_LIST[name]._owner == address(0), "Name already registered.");
        /// @dev maxmimum slot
        require(RelayerCount < MaximumRelayers, "Maximum relayers registered");

        /// @notice Do we need to check the duplication of Token trade-pairs?
        Relayer memory relayer = Relayer(coinbase, msg.value, makerFee, takerFee, fromTokens, toTokens);
        RelayerOwnership memory ownership = RelayerOwnership(coinbase, msg.sender);

        RELAYER_OWNER_LIST[msg.sender][name] = relayer;
        RELAYER_OWNERSHIP_LIST[name] = ownership;
        RELAYER_COINBASE_LIST[coinbase] = name;
        RELAYER_NAME_LIST[msg.sender].push(name);

        RelayerCount++;

        emit RegisterEvent(RELAYER_COINBASE_LIST[coinbase], RELAYER_OWNERSHIP_LIST[name]._coinbase, RELAYER_NAME_LIST[msg.sender]);
    }


    function update(string memory name, string memory newName, uint16 makerFee, uint16 takerFee, address[] memory fromTokens, address[] memory toTokens)
        public
        relayerOwnerOnly(name)
        onlyActiveRelayer(name)
    {
        require(bytes(name).length >= 3 && bytes(name).length <= 32);
        require(bytes(newName).length >= 3 && bytes(newName).length <= 32);
        require(makerFee >= 1 && makerFee < 1000, "Invalid Maker Fee");
        require(takerFee >= 1 && takerFee < 1000, "Invalid Taker Fee");
        require(fromTokens.length <= MaximumTokenList, "Exceeding number of trade pairs");
        require(toTokens.length == fromTokens.length, "Not valid number of Pairs");

        RELAYER_OWNER_LIST[msg.sender][name]._makerFee = makerFee;
        RELAYER_OWNER_LIST[msg.sender][name]._takerFee = takerFee;
        RELAYER_OWNER_LIST[msg.sender][name]._fromTokens = fromTokens;
        RELAYER_OWNER_LIST[msg.sender][name]._toTokens = toTokens;

        if (compareStrings(name, newName)) {
            emit UpdateEvent(name, RELAYER_OWNER_LIST[msg.sender][name]._deposit);
        } else {
            require(RELAYER_OWNERSHIP_LIST[newName]._owner == address(0), "Name is ready taken");

            Relayer memory relayer = RELAYER_OWNER_LIST[msg.sender][name];
            RelayerOwnership memory ownership = RELAYER_OWNERSHIP_LIST[name];
            address coinbase = relayer._coinbase;

            delete RELAYER_OWNER_LIST[msg.sender][name];
            delete RELAYER_OWNERSHIP_LIST[name];

            RELAYER_OWNER_LIST[msg.sender][newName] = relayer;
            RELAYER_OWNERSHIP_LIST[newName] = ownership;
            RELAYER_COINBASE_LIST[coinbase] = newName;

            for (uint i = 0; i < RELAYER_NAME_LIST[msg.sender].length; i++) {
                if (compareStrings(RELAYER_NAME_LIST[msg.sender][i], name)) {
                    RELAYER_NAME_LIST[msg.sender][i] = newName;
                }
            }

            emit UpdateEvent(newName, RELAYER_OWNER_LIST[msg.sender][newName]._deposit);
        }

    }


    function depositMore(string memory name)
        public
        relayerOwnerOnly(name)
        onlyActiveRelayer(name)
        nonZeroValue
        payable
    {
        RELAYER_OWNER_LIST[msg.sender][name]._deposit += msg.value;
        emit UpdateEvent(name, RELAYER_OWNER_LIST[msg.sender][name]._deposit);
    }


    function withdraw(string memory name, uint256 requestAmount)
        public
        relayerOwnerOnly(name)
        onlyActiveRelayer(name)
    {
        require(requestAmount > 0 ether, "Invalid withdrawal amount");
        require(RELAYER_OWNER_LIST[msg.sender][name]._deposit - requestAmount >= MinimumDeposit, "Deposit must remain greater or equal the MinimumDeposit");

        RELAYER_OWNER_LIST[msg.sender][name]._deposit -= requestAmount;
        msg.sender.transfer(requestAmount);
        emit UpdateEvent(name, RELAYER_OWNER_LIST[msg.sender][name]._deposit);
    }


    function changeOwnership (string memory name, address new_owner, address new_coinbase)
        public
        relayerOwnerOnly(name)
        onlyActiveRelayer(name)
    {
        require(new_owner != address(0));
        require(new_coinbase != address(0));

        address currentCoinbase = RELAYER_OWNERSHIP_LIST[name]._coinbase;

        if (currentCoinbase != new_coinbase) {
            // @dev user request to change coinbase
            require(bytes(RELAYER_COINBASE_LIST[new_coinbase]).length == 0, "This coinbase already registered");
        }

        Relayer memory relayer = RELAYER_OWNER_LIST[msg.sender][name];
        RelayerOwnership memory ownership = RELAYER_OWNERSHIP_LIST[name];

        delete RELAYER_OWNER_LIST[msg.sender][name];
        delete RELAYER_COINBASE_LIST[relayer._coinbase];

        relayer._coinbase = new_coinbase;
        ownership._coinbase = new_coinbase;
        ownership._owner = new_owner;

        RELAYER_OWNER_LIST[new_owner][name] = relayer;
        RELAYER_OWNERSHIP_LIST[name] = ownership;
        RELAYER_COINBASE_LIST[new_coinbase] = name;

        uint relayerListLength = RELAYER_NAME_LIST[msg.sender].length;
        for (uint i = 0; i < relayerListLength; i++) {
            if (compareStrings(RELAYER_NAME_LIST[msg.sender][i], name)) {
                RELAYER_NAME_LIST[msg.sender][i] = RELAYER_NAME_LIST[msg.sender][relayerListLength - 1];
                delete RELAYER_NAME_LIST[msg.sender][relayerListLength - 1];
            }
        }

        RELAYER_NAME_LIST[new_owner].push(name);

        emit ChangeOwnershipEvent(name, RELAYER_OWNERSHIP_LIST[name]._owner, RELAYER_OWNERSHIP_LIST[name]._coinbase);
    }


    function resign(string memory name)
        public
        relayerOwnerOnly(name)
    {
        require(RELAYER_OWNER_LIST[msg.sender][name]._coinbase != address(0), "No relayer associated with this address");
        require(RELAYER_OWNER_LIST[msg.sender][name]._deposit > 0, "No deposit remains");
        require(RESIGN_REQUESTS[name] == 0, "Request already received");

        RESIGN_REQUESTS[name] = now + 4 weeks;
        emit ResignEvent(RESIGN_REQUESTS[name], RELAYER_OWNER_LIST[msg.sender][name]._deposit);
    }


    function refund(string memory name)
        public
        relayerOwnerOnly(name)
    {
        require(RESIGN_REQUESTS[name] > 0, "Request not found");
        uint256 amount = RELAYER_OWNER_LIST[msg.sender][name]._deposit;

        if (RESIGN_REQUESTS[name] < now) {
            /// Passed the release time, return the deposit to user
            address currentCoinbase = RELAYER_OWNER_LIST[msg.sender][name]._coinbase;

            delete RELAYER_OWNER_LIST[msg.sender][name];
            delete RELAYER_OWNERSHIP_LIST[name];
            delete RELAYER_COINBASE_LIST[currentCoinbase];
            delete RESIGN_REQUESTS[name];

            for (uint i = 0; i < RELAYER_NAME_LIST[msg.sender].length; i++) {
                if (compareStrings(RELAYER_NAME_LIST[msg.sender][i], name)) {
                    delete RELAYER_NAME_LIST[msg.sender][i];
                }
            }

            RelayerCount--;

            msg.sender.transfer(amount);
            emit RefundEvent(true, 0, amount);
        } else {
            /// Not yet, remind user about the remaining time...
            emit RefundEvent(false, RESIGN_REQUESTS[name] - now, amount);
        }
    }


    function relayerMetaView(string memory name)
        public
        view
        relayerOwnerOnly(name)
        returns (Relayer memory)
    {
        return (RELAYER_OWNER_LIST[msg.sender][name]);
    }


    function getRelayerNames()
        public
        view
        returns (string[] memory)
    {
        return (RELAYER_NAME_LIST[msg.sender]);
    }


    /// @dev Utils functions
    function compareStrings(string memory s1, string memory s2)
        public
        pure
        returns (bool)
    {
        return keccak256(abi.encodePacked(s1)) == keccak256(abi.encodePacked(s2));
    }

}
