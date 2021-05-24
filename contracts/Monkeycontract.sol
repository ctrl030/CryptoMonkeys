pragma solidity 0.5.12;

// preparing for some functions to be restricted 
import "./Ownable.sol";

// preparing safemath to rule out over- and underflow  
import "./Safemath.sol";

// importing ERC721 token standard interface
import "./IERC721.sol";

// importing interface to check if receiving address is a contract
import "./IERC721Receiver.sol";

contract MonkeyContract is IERC721, Ownable {

    // using safemath for all uint256 numbers, 
    // use uint256 and (.add) and (.sub)
    using SafeMath for uint256;


    // State variables

    // MonkeyContract address
    address _monkeyContractAddress;   
     
    bytes4 internal constant confirmingERC721Received = bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));

    bytes4 private constant _INTERFACE_ID_ERC721 = 0x80ac58cd;
    bytes4 private constant _INTERFACE_ID_ERC165 = 0x01ffc9a7; 

    // Only 12 monkeys can be created from scratch (generation 0)
    uint256 public GEN0_Limit = 12;
    uint256 public gen0amountTotal;

    // name will be set to "Crypto Monkeys"
    string private _name;

    // ticker symbol will be set to "NFT"
    string private _symbol;

    // amount of NFTs total in existence - can be queried by totalSupply function    
    uint256 public totalSupply;

    // this struct is the blueprint for new NFTs, they will be created from it
    struct CryptoMonkey {        
        uint256 parent1Id;
        uint256 parent2Id;
        uint256 generation;
        uint256 genes;
        uint256 birthtime;
    }

    // a mapping to store each address's number of Crypto Monkeys 
    // can be queried by balanceOf function
    mapping(address => uint256) private _numberOfNFTsOfAddressMapping;

    // mapping of all the tokenIds and their ownerssss 
    // can be queried by ownerOf function 
    mapping(uint256 => address) private _monkeyIdsAndTheirOwnersMapping;

    // mapping of the allowed addresses for a piece 
    mapping(uint256 => address) private _NFT2AllowedAddressMapping;

    // This is an array that holds all CryptoMonkeys. 
    // Their position in that array IS their tokenId.
    // they never get deleted here, array only grows and keeps track of them all.
    CryptoMonkey[] public allMonkeysArray;

    // mapping owner address to 
    // operator address (who has approval over all of owner's NFTs) to
    // boolean that shows if the operator address actually is operator or not
    mapping (address => mapping (address => bool)) private operatorApprovalsMapping;  

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

    // Operator status event
    event ApprovalForAll (address msgsender, address operator, bool _approved);

    // Creation event, emitted after successful NFT creation with these parameters
    event MonkeyCreated(
        address owner,
        uint256 tokenId,
        uint256 parent1Id,
        uint256 parent2Id,
        uint256 genes
    );

    event BreedingSuccessful (uint256 tokenId, uint256 genes, uint256 birthtime, uint256 parent1Id, uint256 parent2Id, uint256 generation, address owner);

    // After transfer of NFT, emitting useful data regarding new owner
    event NewOwnerArrayUpdated( 
        address transferringAddress,       
        address oldOwner,
        uint256 tokenId,
        address newOwner,
        uint256[] newOwnerArrayUpdated,
        uint256 positionInNewOwnersArray
    );


    // After transfer of NFT, emitting useful data regarding old owner
    event OldOwnerArrayUpdated(        
        uint256 tokenId,
        address oldOwner,
        uint256[] oldOwnerArrayUpdated        
    );


    // Constructor function
    // is setting _name, and _symbol, as well as creating a couple of test NFTs,
    // and for them setting _parent1Id, _parent2Id and _generation to 0, 
    // the _genes to the biggest possible uint256 number (overflow on purpose)
    // and _owner to contract address

    constructor() public {
        _name = "Crypto Monkeys";
        _symbol = "NFT";
        _monkeyContractAddress = address(this);      
        
        _createMonkey(0, 0, 0, 1214131177989271, address(0));
        
    }

    // Functions 


    function getMonkeyContractAddress() public view returns (address) {  
        return _monkeyContractAddress;
    }    


    function supportsInterface (bytes4 _interfaceId) external view returns (bool){
        return (_interfaceId == _INTERFACE_ID_ERC721 || _interfaceId == _INTERFACE_ID_ERC165);
    }


    function breed(uint256 _parent1Id, uint256 _parent2Id) public returns (uint256) {

        // msg.sender needs to be owner of both crypto monkeys
        require(msg.sender == _monkeyIdsAndTheirOwnersMapping[_parent1Id] && msg.sender == _monkeyIdsAndTheirOwnersMapping[_parent2Id]);

        // first 8 digits are selected by dividing, solidity will round down everything to full integers
        uint256 _parent1genes = allMonkeysArray[_parent1Id].genes; 

        // second 8 digits are selected by using modulo, it's whats left over and undividable by 100000000
        uint256 _parent2genes = allMonkeysArray[_parent2Id].genes; 

        // calculating new DNA string
        uint256 _newDna = _mixDna(_parent1genes, _parent2genes);

        // calculate generation here
        uint256 _newGeneration = _calcGeneration(_parent1Id, _parent2Id);

        // creating new monkey
        uint256 newMonkeyId = _createMonkey(_parent1Id, _parent2Id, _newGeneration, _newDna, msg.sender);                       

        emit BreedingSuccessful(
            newMonkeyId,
            allMonkeysArray[newMonkeyId].genes,
            allMonkeysArray[newMonkeyId].birthtime,
            allMonkeysArray[newMonkeyId].parent1Id,
            allMonkeysArray[newMonkeyId].parent2Id,
            allMonkeysArray[newMonkeyId].generation,
            _monkeyIdsAndTheirOwnersMapping[newMonkeyId]
        );       

        return newMonkeyId;
    }

    

    function _calcGeneration (uint256 _parent1Id, uint256 _parent2Id) internal view returns(uint256) {

        uint256 _generationOfParent1 = allMonkeysArray[_parent1Id].generation; 
        uint256 _generationOfParent2 = allMonkeysArray[_parent2Id].generation; 

        // new generation is average of parents generations plus 1
        // for ex. 1 + 5 = 6, 6/2 = 3, 3+1=4, newGeneration would be 4

        // rounding numbers if odd, for ex. 1+2=3, 3*10 = 30, 30/2 = 15
        // 15 % 10 = 5, 5>0, 15+5=20
        // 20 / 10 = 2, 2+1 = 3
        // newGeneration = 3
        uint256 _roundingNumbers = (((_generationOfParent1 + _generationOfParent2) * 10) / 2); 
        if (_roundingNumbers % 10 > 0) {
            _roundingNumbers + 5;      
        }
        uint256 newGeneration = (_roundingNumbers / 10 ) + 1;

        return newGeneration;
    }

    // will generate a pseudo random number and from that decide whether to take mom or dad genes, repeated for 8 pairs of 2 digits each
    function _mixDna (uint256 _parent1genes, uint256 _parent2genes) internal view returns (uint256) {

        // an array with size 8 (will hold 8 pairs of 2 digits each)
        uint256[8] memory geneArray;
        
        // timestamp of now is converted into 8 bits and modulo 255 is applied,
        // resulting in pseudo random number from 0-255, expressed in 8 bit: 00000000 - 11111111
        uint8 pseudoRandom8bits = uint8(now %255);

        uint256 i = 1;

        // will be used to count down, start at end of string
        uint256 index = 7;

        // Doing a Bitwise Operation
        // looping from 1 to 128, each step index is doubling, i.e. 1, 2, 4, 8, 16, 32, 64, 128, loop will therefore run 8 times 
        /* in 8 bit format, these numbers are written like this: 
        00000001 = 1
        00000010 = 2
        00000100 = 4
        00001000 = 8   
        00010000 = 16
        00100000 = 32
        01000000 = 64
        10000000 = 128  
        & - bitwise operator "and", can compare digits, for ex.
        00000010 & 10100010 will resolve to true, since second last digit is 1 in both cases
        00000100 & 10100010 will resolve to false, since no digits are same
        */
        for ( i = 1; i <= 128; i=i*2) {
            if (pseudoRandom8bits & i != 0){
                // puts the last 2 digits of genes number string into next position in geneArray each time
                // the array will therefore be backwards in comparison to the old genes strings
                geneArray[index] = uint8(_parent1genes % 100);
            } else {
                geneArray[index] = uint8(_parent2genes % 100);
            }

            //each loop, take off the last 2 digits from the genes number string
            _parent1genes = _parent1genes / 100;
            _parent2genes = _parent2genes / 100;

            // counting down the index, for practically setting the 8 positions in the geneArray from back to front,
            // starting with geneArray[7] and counting down
            index = index -1;             
        }

        uint256 newGeneSequence; 

        // Taken out, only for selectng random pair
        //uint256 randomPairSelector = uint256(uint256(pseudoRandom8bits) % 8); 

        uint256 pseudoRandomAdv = uint256(keccak256(abi.encodePacked(now, uint256(pseudoRandom8bits), totalSupply, allMonkeysArray[allMonkeysArray.length-1].genes)));         

        // makes this number a 2 digit number between 10-98
        pseudoRandomAdv = (pseudoRandomAdv % 89) + 10;

        // setting first 2 digits in DNA string to random numbers
        geneArray[0] = pseudoRandomAdv;
        
        // puts in last positioned array entry (2 digits) as first numbers, then adds 00, then adds again,
        // therefore reversing the backwards information in the array again to correct order 
        for (i = 0; i < 8; i++) {
            newGeneSequence = newGeneSequence + geneArray[i];

            // will stop adding zeros after last repetition
            if (i != 7)  {
                newGeneSequence = newGeneSequence * 100;
            }                
        } 

        /*
        newGeneSequence = newGeneSequence / 100;

        newGeneSequence = newGeneSequence *100;
        */    
        return newGeneSequence;        
    }

    // gives back an array with the NFT tokenIds that the provided sender address owns
    function findMonkeyIdsOfAddress(address sender) public view returns (uint256[] memory) {  
        return _owners2tokenIdArrayMapping[sender];
    }

    // gives back an array with the NFT tokenIds that are owned by the calling msg.sender 
    function showMyMonkeyNFTs() public view returns (uint256[] memory) {  
        return _owners2tokenIdArrayMapping[msg.sender];
    }


    // used for creating gen0 monkeys 
    function createGen0Monkey(uint256 _genes) public onlyOwner {
        // making sure that no more than 12 monkeys will exist in gen0
        require(gen0amountTotal < GEN0_Limit);

        // increasing counter of gen0 monkeys 
        gen0amountTotal++;

        // creating
        _createMonkey(0, 0, 0, _genes, msg.sender);
        
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

        // updating total supply
        totalSupply++;
        
        // the push function also returns the length of the array, using that directly and saving it as the ID, starting with 0
        uint256 newMonkeyId = allMonkeysArray.push(newMonkey) - 1;

        // emitting before the action
        emit MonkeyCreated(_owner, newMonkeyId, _parent1Id, _parent2Id, _genes);

        // after creation, transferring to new owner, 
        // transferring address is user, sender is 0 address
        _transferCallfromInside(msg.sender, address(0), _owner, newMonkeyId);        

        // tokenId is returned
        return newMonkeyId;
    }


    /// @notice Get the approved address for a single NFT
    /// @dev Throws if `_tokenId` is not a valid NFT.
    /// @param _tokenId The NFT to find the approved address for
    /// @return The approved address for this NFT, or the zero address if there is none
    // function getApproved(uint256 _tokenId) external view returns (address);
    function getApproved(uint256 _tokenId) external view returns (address){
        return _NFT2AllowedAddressMapping[_tokenId];
    }  

    /// @notice Query if an address is an authorized operator for another address
    /// @param _owner The address that owns the NFTs
    /// @param _operator The address that acts on behalf of the owner
    /// @return True if `_operator` is an approved operator for `_owner`, false otherwise
    function isApprovedForAll(address _owner, address _operator) external view returns (bool){
        return operatorApprovalsMapping[_owner][_operator];
    }



    // gives back all the main details on a NFT
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
            _NFT2AllowedAddressMapping[tokenId]
        );
    }



    // The approve function allows another address to take / move your NFT
    function approve(address _approved, uint256 _tokenId) public {

        address monkeyOwner = _monkeyIdsAndTheirOwnersMapping[_tokenId];

        bool senderHasOperatorStatus = operatorApprovalsMapping[monkeyOwner][msg.sender];

        // requires that the msg.sender is the owner or operator of the NFT to be moved
        require(monkeyOwner == msg.sender || senderHasOperatorStatus);

        // emitting before the action
        emit Approval(msg.sender, _approved, _tokenId);

        // stores the allowed address into the mapping for it, with the monkey being the key
        // before this, allowedAddress is 0, meaning nobody can take it
        _NFT2AllowedAddressMapping[_tokenId] = _approved;
    }



    // allows or revokes an address to get "operator" status, being allowed to take or move all of msg.sender 's NFTs
    function setApprovalForAll(address _operator, bool _approved) external {

        // msg.sender can set entry in his own mapping for _operator address to true or false
        operatorApprovalsMapping[msg.sender][_operator] = _approved;

        // emitting ApprovalForAll event with owner address, operator related address, boolean whether is operator or not
        emit ApprovalForAll(msg.sender, _operator, _approved);        
    }

   

    // Returns the name of the token
    function name() external view returns (string memory) {
        return _name;
    }

    // Returns the symbol of the token
    function symbol() external view returns (string memory) {
        return _symbol;
    }

    /*
        // Returns the _totalSupply if it exists as private state variable
        function totalSupply() external view returns (uint256) {
            return _totalSupply;
        }
    */

    // Returns the amount of tokens in an address' account
    function balanceOf(address owner) external view returns (uint256) {
        return _numberOfNFTsOfAddressMapping[owner];
    }

    // returns the owner of given tokenId, which is stored in the _monkeyIdsAndTheirOwnersMapping at the [tokenId] position
    function ownerOf(uint256 tokenId) external view returns (address) {
        return _monkeyIdsAndTheirOwnersMapping[tokenId];
    }

    // For transferring, can be called from outside, at the moment does same as transferFrom
    function transfer(address _to, uint256 _tokenId) external {
        
        //`to` cannot be the zero address.
        require(_to != address(0));

        // to` cannot be the contract address.
        require(_to != address(this));

        address monkeyOwner = _monkeyIdsAndTheirOwnersMapping[_tokenId];

        bool senderHasOperatorStatus = operatorApprovalsMapping[monkeyOwner][msg.sender];

        address allowedAddress = _NFT2AllowedAddressMapping[_tokenId];

        // _tokenId must be a valid NFT tokenId, 
        // i.e. 0 or larger, and smaller than the length of allMonkeysArray
        require(_tokenId >= 0 && _tokenId < allMonkeysArray.length);    

        require(monkeyOwner == msg.sender || senderHasOperatorStatus == true || allowedAddress == msg.sender);        
        
        // calling internal transfer function, providing both msg.sender as well as owner, in case they are different (operator is acting)
        _transferCallfromInside(msg.sender, monkeyOwner, _to, _tokenId);
    }


    /// @notice Transfer ownership of an NFT -- THE CALLER IS RESPONSIBLE
    ///  TO CONFIRM THAT `_to` IS CAPABLE OF RECEIVING NFTS OR ELSE
    ///  THEY MAY BE PERMANENTLY LOST
    /// @dev Throws unless `msg.sender` is the current owner, an authorized
    ///  operator, or the approved address for this NFT. Throws if `_from` is
    ///  not the current owner. Throws if `_to` is the zero address. Throws if
    ///  `_tokenId` is not a valid NFT.
    /// @param _from The current owner of the NFT
    /// @param _to The new owner
    /// @param _tokenId The NFT to transfer    
    function transferFrom(address _from, address _to, uint256 _tokenId) external {

        require (_isOwnerOrOperatorOrAllowed(_from, _to, _tokenId));

        address monkeyOwner = _monkeyIdsAndTheirOwnersMapping[_tokenId];

        _transferCallfromInside(msg.sender, monkeyOwner, _to, _tokenId);

    }    


    /// @notice Transfers the ownership of an NFT from one address to another address
    /// @dev Throws unless `msg.sender` is the current owner, an authorized
    ///  operator, or the approved address for this NFT. Throws if `_from` is
    ///  not the current owner. Throws if `_to` is the zero address. Throws if
    ///  `_tokenId` is not a valid NFT. When transfer is complete, this function
    ///  checks if `_to` is a smart contract (code size > 0). If so, it calls
    ///  `onERC721Received` on `_to` and throws if the return value is not
    ///  `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`.
    /// @param _from The current owner of the NFT
    /// @param _to The new owner
    /// @param _tokenId The NFT to transfer
    /// @param data Additional data with no specified format, sent in call to `_to`
    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes calldata data) external {

        require (_isOwnerOrOperatorOrAllowed(_from, _to, _tokenId));

        _safeTransferFrom(_from, _to, _tokenId, data);
    }

    
    /// @notice Transfers the ownership of an NFT from one address to another address
    /// @dev This works identically to the other function with an extra data parameter,
    ///  except this function just sets data to "".
    /// @param _from The current owner of the NFT
    /// @param _to The new owner
    /// @param _tokenId The NFT to transfer
    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external {

        require (_isOwnerOrOperatorOrAllowed(_from, _to, _tokenId));

        bytes memory _data = ""; 

        _safeTransferFrom(_from, _to, _tokenId, _data);

    }

    // internal function
    function _safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes memory _data) internal {  

        _transferCallfromInside(msg.sender, _from, _to, _tokenId);       

        require(_checkERC721Support(_from, _to, _tokenId, _data));
        
    }

    function _isOwnerOrOperatorOrAllowed(address _from, address _to, uint256 _tokenId) internal view returns (bool) {
        //`_to` cannot be the zero address.
        require(_to != address(0));

        // _to` can not be the contract address.
        require(_to != address(this));

        // _tokenId must be a valid NFT tokenId, 
        // i.e. 0 or larger, and smaller than the length of allMonkeysArray
        require(_tokenId >= 0 && _tokenId < allMonkeysArray.length);        

        address monkeyOwner = _monkeyIdsAndTheirOwnersMapping[_tokenId];

        // _from address must be monkeyOwner at this moment  
        require(_from == monkeyOwner);

        bool senderHasOperatorStatus = operatorApprovalsMapping[monkeyOwner][msg.sender];

        address allowedAddress = _NFT2AllowedAddressMapping[_tokenId];

        // sender of transfer is owner, or has operator status, or has allowance to move this particular NFT
        require(monkeyOwner == msg.sender || senderHasOperatorStatus == true || allowedAddress == msg.sender);

        return true;

    }

    // internal function for transferring, cannot be called from outside the contract
    function _transferCallfromInside(
        address _transferSender, // i.e. owner so far or operator
        address _monkeyOwner, // i.e. owner so far 
        address _to, // i.e. new owner 
        uint256 _tokenId
    ) internal {
        // deleting any allowed address for the transfered NFT
        delete _NFT2AllowedAddressMapping[_tokenId];

        // transferring, i.e. changing ownership entry in the _monkeyIdsAndTheirOwnersMapping for the tokenId
        _monkeyIdsAndTheirOwnersMapping[_tokenId] = _to;

        // updating "balance" of address in _numberOfNFTsOfAddressMapping, so that the "to" address has 1 NFT more
        _numberOfNFTsOfAddressMapping[_to] = _numberOfNFTsOfAddressMapping[_to].add(1);


        // if NFT owner at this point is NOT 0 address (happens during gen0 monkey creation),
        // updating "balance" of address in _numberOfNFTsOfAddressMapping,  so that the previous monkey owner has 1 NFT less      
        if (_monkeyOwner != address(0)) {
            _numberOfNFTsOfAddressMapping[_monkeyOwner] = _numberOfNFTsOfAddressMapping[_monkeyOwner].sub(1);
        }

        // saving tokenId to new owner's array in the mapping for all owners, 
        // also see next action below (storing position)
        _owners2tokenIdArrayMapping[_to].push(_tokenId);

        // inside the global mapping for positions, under the new owner, under the tokenId, 
        // saving the position that this tokenId has in the other array (_owners2tokenIdArrayMapping), 
        // by measuring that arrays length, after pushing the NFT to it, then subtracting 1
        // that means owner's first monkey will be in position 0
        MonkeyIdPositionsMapping[_to][_tokenId] = _owners2tokenIdArrayMapping[_to].length - 1;

        // emitting useful data regarding new owner after transfer of NFT
        emit NewOwnerArrayUpdated(
            _transferSender,            
            _monkeyOwner,
            _tokenId,
            _to,
            _owners2tokenIdArrayMapping[_to],
            MonkeyIdPositionsMapping[_to][_tokenId]
        );  
        
        // deleting the tokenId from the old owners array of monkeys
        if ((_owners2tokenIdArrayMapping[_monkeyOwner]).length > 0 ){
            delete _owners2tokenIdArrayMapping[_monkeyOwner][MonkeyIdPositionsMapping[_monkeyOwner][_tokenId]];
        }                

        // deleting the saved index position, since old address is not longer owner
        delete MonkeyIdPositionsMapping[_monkeyOwner][_tokenId];

        // emitting useful data regarding old owner after transfer of NFT
        emit OldOwnerArrayUpdated(            
            _tokenId,
            _monkeyOwner,
            _owners2tokenIdArrayMapping[_monkeyOwner]
        );

        // emitting Transfer event
        emit Transfer(_monkeyOwner, _to, _tokenId);
    }

    // Wrapper function to avaliate if receiving address is a smart contract or just a wallet address
    // Returns true if contract, false if wallet or does not accept ERC721s   
    function _checkERC721Support(address _from, address _to, uint256 _tokenId, bytes  memory _data) internal returns(bool) {
        // First checks if codesize of receiving address is not larger than 0. If it is not, returns true 
        if (!_isContract(_to)){
            return true;
        }

        // if codesize was larger than 0, checks if contract can receive ERC721s
        bytes4 returnData = IERC721Receiver(_to).onERC721Received(msg.sender, _from, _tokenId, _data); 
        // comparing and evaluating to true or false
        return returnData == confirmingERC721Received;
    }

    // checking code size of _to address    
    function _isContract (address _to) view internal returns(bool) {
        uint32 size;
        assembly {
            size := extcodesize(_to)
        }
        return size > 0;
    }

}