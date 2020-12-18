pragma solidity 0.5.12;

// preparing for some functions to be restricted 
import "./Ownable.sol";

// preparing safemath to rule out over- and underflow  
import "./Safemath.sol";

// importing ERC721 token standard interface
import "./IERC721.sol";

contract MonkeyContract is IERC721, Ownable {

    // using safemath for all uint256 numbers, 
    // use uint256 and (.add) and (.sub)
    using SafeMath for uint256;


    // State variables

    // Only 12 monkeys can be created from scratch (generation 0)
    uint256 public GEN0_Limit = 12;
    uint256 public gen0amountTotal;

    // name will be set to "Crypto Monkeys"
    string private _name;

    // ticker symbol will be set to "CMO"
    string private _symbol;

    // amount of CMOs total in existence - can be queried by totalSupply function    
    uint256 private _totalSupply;

    // this struct is the blueprint for new CMOs, they will be created from it
    struct CryptoMonkey {        
        uint256 parent1Id;
        uint256 parent2Id;
        uint256 generation;
        uint256 genes;
        uint256 birthtime;
    }

    // a mapping to store each address's number of Crypto Monkeys 
    // can be queried by balanceOf function
    mapping(address => uint256) private _numberOfCMOsOfAddressMapping;

    // mapping of all the tokenIds and their ownerssss 
    // can be queried by ownerOf function 
    mapping(uint256 => address) private _monkeyIdsAndTheirOwnersMapping;

    // mapping of the allowed addresses for a piece 
    mapping(uint256 => address) private _CMO2AllowedAddressMapping;

    // This is an array that holds all CryptoMonkeys. 
    // Their position in that array IS their tokenId.
    // they never get deleted here, array only grows and keeps track of them all.
    CryptoMonkey[] public allMonkeysArray;

    /* 
        not implemented, thinking about how a mapping would work,
       providing same functionality as allMonkeysArray    
       mapping(uint256 => CryptoMonkey) public _MonkeyIds2CryptoMonkeyMapping;
    */

    // used to keep track of owners and their crypto monkeys (see below)
    // owner to tokenid to position in this array: _owners2tokenIdArrayMapping
    mapping(address => mapping(uint256 => uint256)) public MonkeyIdPositionsMapping;

    // maps owner to an array that holds all their tokenIds (see above)
    // tokenId positions are saved in this mapping: MonkeyIdPositionsMapping)
    mapping(address => uint256[]) public _owners2tokenIdArrayMapping;

   
    //- gives back an array with the CMO tokenIds that the provided sender address owns
    function findMonkeyIdsOfAddress(address sender) public view returns (uint256[] memory) {  
        return _owners2tokenIdArrayMapping[sender];
    }


    // Events

    // Transfer event, emitted after successful transfer with these parameters
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );

    // Approval event, emitted after successful approval with these parameters
    event Approval(
        address indexed owner,
        address indexed approved,
        uint256 indexed tokenId
    );

    // Creation event, emitted after successful CMO creation with these parameters
    event MonkeyCreated(
        address owner,
        uint256 tokenId,
        uint256 parent1Id,
        uint256 parent2Id,
        uint256 genes
    );

    // After transfer of CMO, emitting useful data regarding new owner
    event NewOwnerArrayUpdated(
        uint256 tokenId,
        address newOwner,
        uint256[] newOwnerArrayUpdated,
        uint256 positionInNewOwnersArray
    );
    // After transfer of CMO, emitting useful data regarding old owner
    event OldOwnerArrayUpdated(
        uint256 tokenId,
        address oldOwner,
        uint256[] oldOwnerArrayUpdated        
    );


    // Constructor function
    // is setting _name, and _symbol, as well as creating a couple of test CMOs,
    // and for them setting _parent1Id, _parent2Id and _generation to 0, 
    // the _genes to the biggest possible uint256 number (overflow on purpose)
    // and _owner to contract address

    constructor() public {
        _name = "Crypto Monkeys";
        _symbol = "CMO";

        _createMonkey(0, 0, 0, uint256(-1), address(this));

        _createMonkey(0, 0, 0, uint256(-1), address(this));

        _createMonkey(0, 0, 0, uint256(-1), address(this));

        _createMonkey(0, 0, 0, uint256(-1), address(this));
    }


    // Functions 

    // used for creating gen0 monkeys 

    function createGen0Monkey(uint256 _genes) public onlyOwner {
        // making sure that no more than 12 monkeys will exist in gen0
        require(gen0amountTotal < GEN0_Limit);

        // increasing counter of gen0 monkeys 
        gen0amountTotal++;

        // creating
        _createMonkey(0, 0, 0, _genes, msg.sender);

        // updating total supply
        _totalSupply++;
    }

    // used for creating monkeys (returns tokenId, could be used)
    function _createMonkey(
        uint256 _parent1Id,
        uint256 _parent2Id,
        uint256 _generation,
        uint256 _genes,
        address _owner
    ) private returns (uint256) {
        // uses the CryptoMonkey struct as template and creates a newMonkey from it
            CryptoMonkey memory newMonkey = CryptoMonkey({                
            parent1Id: uint256(_parent1Id),
            parent2Id: uint256(_parent2Id),
            generation: uint256(_generation),
            genes: _genes,
            birthtime: uint256(now)
        });

        // the push function also returns the length of the array, using that directly and saving it as the ID, starting with 0
        uint256 newMonkeyId = allMonkeysArray.push(newMonkey) - 1;

        // emitting before the action
        emit MonkeyCreated(_owner, newMonkeyId, _parent1Id, _parent2Id, _genes);

        // after creation, transferring to new owner, sender is 0 address
        _transferCallfromInside(address(0), _owner, newMonkeyId);        

        // tokenId is returned
        return newMonkeyId;
    }


    // gives back all the main details on a CMO
    function getMonkeyDetails(uint256 tokenId)
        public
        view
        returns (
            uint256 genes,
            uint256 birthtime,
            uint256 parent1Id,
            uint256 parent2Id,
            uint256 generation,
            address owner,
            address approvedAddress
        )
    {
        return (
            allMonkeysArray[tokenId].genes,
            allMonkeysArray[tokenId].birthtime,
            allMonkeysArray[tokenId].parent1Id,
            allMonkeysArray[tokenId].parent2Id,
            allMonkeysArray[tokenId].generation,
            _monkeyIdsAndTheirOwnersMapping[tokenId],
            _CMO2AllowedAddressMapping[tokenId]
        );
    }

    // The approve function allows another address to take / move your CMO
    function approve(uint256 tokenId, address allowedAddress) public {
        // requires that the msg.sender is the owner of the CMO to be moved
        require(_monkeyIdsAndTheirOwnersMapping[tokenId] == msg.sender);

        // emitting before the action
        emit Approval(msg.sender, allowedAddress, tokenId);

        // stores the allowed address into the mapping for it, with the monkey being the key
        // before this, allowedAddress is 0, meaning nobody can take it
        _CMO2AllowedAddressMapping[tokenId] = allowedAddress;
    }

    // Returns the name of the token
    function name() external view returns (string memory) {
        return _name;
    }

    // Returns the symbol of the token
    function symbol() external view returns (string memory) {
        return _symbol;
    }

    // Returns the totalSupply
    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    // Returns the amount of tokens in an address' account
    function balanceOf(address owner) external view returns (uint256) {
        return _numberOfCMOsOfAddressMapping[owner];
    }

    // returns the owner of given tokenId, which is stored in the _monkeyIdsAndTheirOwnersMapping at the [tokenId] position
    function ownerOf(uint256 tokenId) external view returns (address) {
        return _monkeyIdsAndTheirOwnersMapping[tokenId];
    }

    // For transferring, can be called from outside 
    function transfer(address _to, uint256 _tokenId) external {
        //`to` cannot be the zero address.
        require(_to != address(0));

        // to` can not be the contract address.
        require(_to != address(this));

        // `tokenId` token must be owned by `msg.sender`
        require(_monkeyIdsAndTheirOwnersMapping[_tokenId] == msg.sender);

        _transferCallfromInside(msg.sender, _to, _tokenId);
    }

    // internal function for transferring, cannot be called from outside the contract
    function _transferCallfromInside(
        address _from,
        address _to,
        uint256 _tokenId
    ) internal {
        // deleting any allowed address for the transfered CMO
        delete _CMO2AllowedAddressMapping[_tokenId];

        // transferring, i.e. changing ownership entry in the _monkeyIdsAndTheirOwnersMapping for the tokenId
        _monkeyIdsAndTheirOwnersMapping[_tokenId] = _to;

        // updating "balance" of address in _numberOfCMOsOfAddressMapping, so that the "to" address has 1 CMO more
        _numberOfCMOsOfAddressMapping[_to] = _numberOfCMOsOfAddressMapping[_to].add(1);


        // if sender is NOT 0 address (happens during gen0 monkey creation),
        // updating "balance" of address in _numberOfCMOsOfAddressMapping,  so that the "_from" address has 1 CMO less
       
        if (_from != address(0)) {
            _numberOfCMOsOfAddressMapping[_from] = _numberOfCMOsOfAddressMapping[_from].sub(1);
        }

        // saving tokenId to new owner's array in the mapping for all owners, 
        // also see next action below (storing position)
        _owners2tokenIdArrayMapping[_to].push(_tokenId);

        // inside the global mapping for positions, under the new owner, under the tokenId, 
        // saving the position that this tokenId has in the other array (_owners2tokenIdArrayMapping), 
        // by measuring that arrays length, after pushing the CMO to it, then subtracting 1
        // that means owner's first monkey will be in position 0
        MonkeyIdPositionsMapping[_to][_tokenId] = _owners2tokenIdArrayMapping[_to].length - 1;

        // emitting useful data regarding new owner after transfer of CMO
        emit NewOwnerArrayUpdated(
            _tokenId,
            _to,
            _owners2tokenIdArrayMapping[_to],
            MonkeyIdPositionsMapping[_to][_tokenId]
        );
        
        // deleting the tokenId from the old owners array of monkeys
        if ((_owners2tokenIdArrayMapping[_from]).length <0 ){
            delete _owners2tokenIdArrayMapping[_from][MonkeyIdPositionsMapping[_from][_tokenId]];
        }                

        // deleting the saved index position, since old address is not longer owner
        delete MonkeyIdPositionsMapping[_from][_tokenId];

        // emitting useful data regarding old owner after transfer of CMO
        emit OldOwnerArrayUpdated(
            _tokenId,
            _from,
            _owners2tokenIdArrayMapping[_from]
        );

        // emitting Transfer event
        emit Transfer(_from, _to, _tokenId);
    }
}
