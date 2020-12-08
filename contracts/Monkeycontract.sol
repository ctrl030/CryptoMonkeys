pragma solidity 0.5.12;

// preparing for some functions to be restricted   - not used?
import "./Ownable.sol";

// using safemath to rule out over- and underflow and such  - seems done
import "./Safemath.sol";

// importing ERC721 token standard interface, all functions need to be fully created  - seems done?
import "./IERC721.sol";

contract MonkeyContract is IERC721, Ownable {
    // using safemath, now should use uint256 for all numbers  - seems done
    using SafeMath for uint256;

    // State variables

    uint256 public GEN0_Limit = 12;
    uint256 public gen0amountTotal;

    // 1 name to store - will be queried by name function  - seems done
    string private _name;

    // 1 symbol to store - will be queried by symbol function - seems done
    string private _symbol;

    // storing the totalSupply - will be queried by totalSupply function
    // - needs to be updated via a real mint function later (connect to Monkey Factory) - seems done for now
    uint256 private _totalSupply;

    // this struct is the blueprint for new CMOs. They will be created from it
    struct CryptoMonkey {        
        uint256 parent1Id;
        uint256 parent2Id;
        uint256 generation;
        uint256 genes;
        uint256 birthtime;
    }



    // a mapping to store each address's number of Crypto Monkeys - will be queried by balanceOf function
    // - must update at minting (seems done) and transfer (seems done)
    mapping(address => uint256) private _numberOfCMOsOfAddressMapping;

    // mapping of all the tokenIds and their ownerssss - will be queried by ownerOf function - seems done
    mapping(uint256 => address) private _monkeyIdsAndTheirOwnersMapping;

    // mapping of the allowed addresses for a piece - entry must be deleted when CMO is transfered - seems done
    mapping(uint256 => address) private _CMO2AllowedAddressMapping;

    // This array holds all CryptoMonkeys that exist in an array. Their position in that array IS their tokenId.
    // they never get deleted here, array only grows and keeps track of them all.
    CryptoMonkey[] public allMonkeysArray;

    // XXX not implemented yet
    // each tokenId points to one CryptoMonkey struct
    // - will be queried by ownerOf function - work on XXX
    // trying to use CryptoMonkey as a data type
    // must get transferable features
    mapping(uint256 => CryptoMonkey) public _MonkeyIds2CryptoMonkeyMapping;

    // here we map the owners to a mapping, in which we map the tokenId they own to the position of that tokenId in the owner's array
    // owner 2 tokenid 2 position in this array: _owners2tokenIdArrayMapping
    mapping(address => mapping(uint256 => uint256)) public MonkeyIdPositionsMapping;

    // maps owner to an array that holds all their tokenIds - must be updated (at transfers etc.),
    // tokenId positions are saved in another mapping (MonkeyIdPositionsMapping)
    mapping(address => uint256[]) public _owners2tokenIdArrayMapping;

    /*
    // retrieves the correct CryptoMonkey struct from the monkeys Array and adds it to 
    function addMonkeyToOwnersCollection(address _owner,  uint256 _tokenId) internal {
        _owners2MappingOfMonkeyIds2CryptoMonkeyMapping[_owner][_tokenId] = allMonkeysArray[_tokenId];
    }
    */

    //- work on XXX
    function findAllMyMonkeyIds(address sender) public view returns (uint256[] memory) {  

        return _owners2tokenIdArrayMapping[sender];
    }

    // Events

    // Transfer event, emit after successful transfer with these parameters  - seems done - why indexed? what does it mean, do I need that?
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );

    // Approval event, emit after successful approval with these parameters  - implement "you can transfer my CMO - functionality"
    event Approval(
        address indexed owner,
        address indexed approved,
        uint256 indexed tokenId
    );

    // Creation event, emit after successful CMO creation with these parameters  -  seems done
    event MonkeyCreated(
        address owner,
        uint256 tokenId,
        uint256 parent1Id,
        uint256 parent2Id,
        uint256 genes
    );

    // XXX
    event NewOwnerArrayUpdated(
        uint256 tokenId,
        address newOwner,
        uint256[] newOwnerArrayUpdated,
        uint256 positionInNewOwnersArray
    );
    // XXX
    event OldOwnerArrayUpdated(
        uint256 tokenId,
        address oldOwner,
        uint256[] oldOwnerArrayUpdated,
        uint256 positionInOldOwnersArray
    );


    // Constructor function, is setting _name, and _symbol - seems done

    constructor() public {
        _name = "Crypto Monkeys";
        _symbol = "CMO";

        _createMonkey(0, 0, 0, uint256(-1), address(this));

        _createMonkey(0, 0, 0, uint256(-1), address(this));

        _createMonkey(0, 0, 0, uint256(-1), address(this));

        _createMonkey(0, 0, 0, uint256(-1), address(this));
    }

    // Functions

    function createGen0Monkey(uint256 _genes) public onlyOwner {
        require(gen0amountTotal < GEN0_Limit);

        gen0amountTotal++;

        _createMonkey(0, 0, 0, _genes, msg.sender);

        _totalSupply++;
    }

    // this function is going to be used for creating gen0 monkeys and also for creating monkeys from combining monkeys, returns monkey ID (tokenId?) - connect / fix / finish
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

        // the push function returns the length of the array, so we use that directly and save it as the ID, starting with 0
        uint256 newMonkeyId = allMonkeysArray.push(newMonkey) - 1;

        // emitting before the action
        emit MonkeyCreated(_owner, newMonkeyId, _parent1Id, _parent2Id, _genes);

        _transferCallfromInside(address(0), _owner, newMonkeyId);

        /*
    // under construction XXX
    addMonkeyToOwnersCollection(_owner, newMonkeyId){
    };
    */

        return newMonkeyId;
    }



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

    // allows another address to take / move your CMO
    function approve(uint256 tokenId, address allowedAddress) public {
        // requires that the msg.sender is the owner of the CMO to be moved
        require(_monkeyIdsAndTheirOwnersMapping[tokenId] == msg.sender);

        // emitting before the action
        emit Approval(msg.sender, allowedAddress, tokenId);

        // stores the allowed address into the mapping for it, with the monkey being the key
        _CMO2AllowedAddressMapping[tokenId] = allowedAddress;
    }

    // Returns the name of the token. - seems done
    function name() external view returns (string memory) {
        return _name;
    }

    // Returns the symbol of the token. - seems done
    function symbol() external view returns (string memory) {
        return _symbol;
    }

    // query the totalSupply - seems done
    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    // Returns the number of tokens in "owner" 's account. - seems done
    function balanceOf(address owner) external view returns (uint256) {
        return _numberOfCMOsOfAddressMapping[owner];
    }

    // returns the owner of given tokenId, which is stored in the _monkeyIdsAndTheirOwnersMapping at the [tokenId] position - seems done
    function ownerOf(uint256 tokenId) external view returns (address) {
        return _monkeyIdsAndTheirOwnersMapping[tokenId];
    }

    function transfer(address _to, uint256 _tokenId) external {
        //`to` cannot be the zero address.
        require(_to != address(0));

        // to` can not be the contract address.
        require(_to != address(this));

        // `tokenId` token must be owned by `msg.sender`
        require(_monkeyIdsAndTheirOwnersMapping[_tokenId] == msg.sender);

        _transferCallfromInside(msg.sender, _to, _tokenId);
    }

    function _transferCallfromInside(
        address _from,
        address _to,
        uint256 _tokenId
    ) internal {
        // deleting any allowed address for the transfered CMO
        delete _CMO2AllowedAddressMapping[_tokenId];

        // transferring, i.e. changing ownership entry in the _monkeyIdsAndTheirOwnersMapping for the tokenId
        _monkeyIdsAndTheirOwnersMapping[_tokenId] = _to;

        // updating "balance" of address in _numberOfCMOsOfAddressMapping, 'to' address has 1 CMO more
        _numberOfCMOsOfAddressMapping[_to] = _numberOfCMOsOfAddressMapping[_to]
            .add(1);

        // updating "balance" of address in _numberOfCMOsOfAddressMapping, sender has 1 CMO less

        if (_from != address(0)) {
            _numberOfCMOsOfAddressMapping[_from] = _numberOfCMOsOfAddressMapping[_from]
                .sub(1);
        }

        // saving tokenId to new owner's array in the mapping for all owners
        _owners2tokenIdArrayMapping[_to].push(_tokenId);

        // inside the global mapping for positions, under the new owner, under the tokenId, we save the position
        // that this tokenId has in the other array (_owners2tokenIdArrayMapping), by measuring that arrays length, after adding to it, than sub 1
        // that means owner's first monkey will be in position 0
        MonkeyIdPositionsMapping[_to][_tokenId] =
            _owners2tokenIdArrayMapping[_to].length -
            1;

        // XXX tokenId, newOwner, newOwnerArrayUpdated, newMonkeyPositionSetTo
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

        // XXX tokenId, oldOwner, oldOwnerArrayUpdated , oldMonkeyPositionSetTo
        emit OldOwnerArrayUpdated(
            _tokenId,
            _from,
            _owners2tokenIdArrayMapping[_from],
            MonkeyIdPositionsMapping[_from][_tokenId]
        );

        emit Transfer(_from, _to, _tokenId);
    }
}
