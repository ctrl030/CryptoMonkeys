// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// preparing for some functions to be restricted 
import "@openzeppelin/contracts/access/Ownable.sol";
// preparing safemath to rule out over- and underflow  
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
// importing ERC721Enumerable token standard interface
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
// importing openzeppelin script to guard against re-entrancy
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
// importing openzeppelin script to make contract pausable
import "@openzeppelin/contracts/security/Pausable.sol";
// importing openzeppelin script for ERC20 tokens
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// importing MonkeyMarketplace interface
import "./IMonkeyMarketplace.sol";

contract MonkeyContract is ERC721Enumerable, Ownable, ReentrancyGuard, Pausable {

    // using safemath for all uint256 numbers, 
    // use uint256 and (.add) and (.sub)
    using SafeMath for uint256;    

    // STATE VARIABLES

    // MonkeyContract address
    address _monkeyContractAddress;   
    // Only 12 monkeys can be created from scratch (generation 0)
    uint256 public GEN0_Limit = 12;
    uint256 public gen0amountTotal;  

    // MonkeyMarketplace interface
    IMonkeyMarketplace private _monkeyMarketInterface;
    // Boolean to control whether transfers have to check for open offers
    bool private _marketConnected = false;    
    
    // function to connect the market contract, should be done right after deployment of contracts
    // when market is connected, NFTs cannot be transfered via this contract while on sale in market
    function connectMarket(address _receivedMarketContractAddress, bool setConnectMarket) external onlyOwner {
        _monkeyMarketInterface = IMonkeyMarketplace(_receivedMarketContractAddress);
        _marketConnected = setConnectMarket;
    }

    // function to check if market is connected
    function checkMarketConnected() external view onlyOwner returns(address marketAddressSaved, bool isMarketConnected) {
        return (
            address(_monkeyMarketInterface),
            _marketConnected
        );
    }

    // variables for Banana Token
    IERC20 public bananaToken;
    // fee for minting and breeding Crypto Monkey NFTs 
    uint256 private _bananaFee = 50; 
   
    // STRUCT

    // this struct is the blueprint for new NFTs
    struct CryptoMonkey {        
        uint256 parent1Id;
        uint256 parent2Id;
        uint256 generation;
        uint256 genes;
        uint256 birthtime;
    }    

    // ARRAYS

    // This is an array that holds all CryptoMonkey NFTs. 
    // IMPORTANT: Their position in this array IS their Token ID.
    // They never get deleted here, array only grows and keeps track of them all.
    CryptoMonkey[] public allMonkeysArray;

    // EVENTS

    // Creation event, emitted after successful NFT creation with these parameters
    event MonkeyCreated(
        address owner,
        uint256 tokenId,
        uint256 parent1Id,
        uint256 parent2Id,
        uint256 genes
    );

    // Breeding event, combining two owned NFTs can create a third, new one
    event BreedingSuccessful (
        uint256 tokenId, 
        uint256 genes, 
        uint256 birthtime, 
        uint256 parent1Id, 
        uint256 parent2Id, 
        uint256 generation, 
        address owner
    );   
    
    // Constructor function
    // starts with setting _name, and _symbol in imported ERC721 contract,
    // as well as setting the address for the Banana Token contract (has to be provided)  
    constructor(address _bananaToken) ERC721("Crypto Monkeys", "MONKEY") {

        // initiates Banana Token interface
        bananaToken = IERC20(_bananaToken);
       // saving address of this contract to state variable
        _monkeyContractAddress = address(this); 

        // minting a placeholder Zero Monkey NFT, that occupies Token ID 0
        _createMonkey(0, 0, 0, 1214131177989271, _msgSender());  

        // burning the placeholder Zero Monkey NFT
        burnNFT(0);
    }

    // Functions 

    // pausing funcionality from OpenZeppelin's Pausable
    function pause() public onlyOwner {
        _pause();
    }

    // unpausing funcionality from OpenZeppelin's Pausable
    function unpause() public onlyOwner {
        _unpause();
    }
    
    // public function to show contract's own address
    function getMonkeyContractAddress() public view returns (address) {  
        return _monkeyContractAddress;
    }   

    // returns all the main details on a NFT
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
            ownerOf(tokenId),
            getApproved(tokenId)
        );
    }   

    // returns an array with the NFT Token IDs that the provided sender address owns    
    function findMonkeyIdsOfAddress(address owner) public view returns (uint256[] memory) {

        // determining amount of owned Crypto Monkeys
        uint256 amountOwned = balanceOf(owner);             

        // creating result array with fixed length
        uint256[] memory ownedTokenIDs = new uint256[](amountOwned);

        // checking via ERC721Enumerable which Token IDs are owned
        for (uint256 indexToCheck = 0; indexToCheck < amountOwned; indexToCheck++ ) {            
            uint256 foundNFT = tokenOfOwnerByIndex(owner, indexToCheck);
            ownedTokenIDs[indexToCheck] = foundNFT;                                  
        } 

        // returning array of NFT Token IDs
        return ownedTokenIDs;        
    }      

    // used for creating generation 0 monkeys 
    function createGen0Monkey(uint256 _genes) public onlyOwner {
        // making sure that no more than 12 monkeys will exist in gen0
        require(gen0amountTotal < GEN0_Limit, "Maximum amount of gen 0 monkeys reached");

        // increasing counter of gen0 monkeys 
        gen0amountTotal++;        

        // minting new monkey NFT to msg.sender, generation and parents gen set to 0
        _createMonkey(0, 0, 0, _genes, _msgSender());        
    }    
        
    // Function to mint demo Monkey NFTs with hardcoded generation 99    
    function createDemoMonkey(               
        uint256 _genes,
        address _owner
    ) public returns (uint256) {
        // needs 50 Banana Token, can get these from faucet contract
        require(bananaToken.balanceOf(_owner) >= _bananaFee, "Not enough Banana Token. Use the free faucet.");
        uint256 _oldBalanceOf = bananaToken.balanceOf(address(this));
        // sends creation fee to contract
        bananaToken.transferFrom(_msgSender(), address(this), _bananaFee);
        // validates that contract received the fees
        assert(bananaToken.balanceOf(address(this)) == _oldBalanceOf + _bananaFee);
        uint256 newMonkey = _createMonkey(99, 99, 99, _genes, _owner);
        return newMonkey;
    }
    
    // used for creating monkeys (returns tokenId of new NFT)
    function _createMonkey(
        uint256 _parent1Id,
        uint256 _parent2Id,
        uint256 _generation,
        uint256 _genes,
        address _owner
    ) private whenNotPaused returns (uint256) {
        // uses the CryptoMonkey struct as template and creates a new monkey NFT from it
            CryptoMonkey memory newMonkey = CryptoMonkey({                
            parent1Id: uint256(_parent1Id),
            parent2Id: uint256(_parent2Id),
            generation: uint256(_generation),
            genes: _genes,
            birthtime: uint256(block.timestamp)
        });        
        
        // saving the new monkey NFT to the allMonkeysArray
        allMonkeysArray.push(newMonkey);
        // getting the array length-1 and saving that as the new Token ID, starting with 0
        uint256 newMonkeyId = allMonkeysArray.length.sub(1);

        // after creation, transferring to new owner, 
        // receiving "to" address is calling user address, sender is 0 address
        _safeMint(_owner, newMonkeyId);    

        // emitting creating event
        emit MonkeyCreated(_owner, newMonkeyId, _parent1Id, _parent2Id, _genes);                    

        // This is the Token ID of the new NFT
        return newMonkeyId;
    } 

    /// * @dev Assign ownership of a specific NFT CryptoMonkey to an address.
    /// * @dev This poses no restriction on _msgSender()
    /// * @param _from The originating "_from" address can be 0 for creation of a monkey
    /// * @param _to The receiving "_to" address cannot be 0 address, nor this contract
    /// * @param _tokenId The Token ID of the monkey NFT to transfer. Must be owned or have allowance or operator from owner   
    function transferNFT(
        address _from,
        address _to,
        uint256 _tokenId
    ) public nonReentrant whenNotPaused{
        // checking if market is connected    
        if ( _marketConnected == true ) {
            // if it is connected, checking if NFT is on sale in market contract  
            bool tokenOnSale = _monkeyMarketInterface.isTokenOnSale(_tokenId);
            require( tokenOnSale != true, "MonkeyContract: NFT is still on sale. Remove offer first." );
        }
        require(_to != address(0), "MonkeyContract: Transfer to the zero address not allowed, burn NFT instead");
        require(_to != address(this), "MonkeyContract: Can't transfer NFTs to this contract");
        require (_isApprovedOrOwner(_msgSender(), _tokenId) == true, "MonkeyContract: Can't transfer this NFT without being owner, approved or operator");   

        // transfering via OpenZeppelin's ERC721
        safeTransferFrom(_from, _to, _tokenId);        
    }

    // burning functionality, just to be called once from the constructor, to clear the zero monkey
    function burnNFT (        
        uint256 _tokenId
    ) private nonReentrant whenNotPaused{     
        require (_isApprovedOrOwner(_msgSender(), _tokenId) == true, "MonkeyContract: Can't burn this NFT without being owner, approved or operator");         
        // burning via openzeppelin
        _burn(_tokenId);       
    }

    // breeding functionality, combining two owned NFTs creates a new third one
    function breed(uint256 _parent1Id, uint256 _parent2Id) public nonReentrant whenNotPaused returns (uint256)  {
        // user needs to have enough Banana Token to use
        require(bananaToken.balanceOf(_msgSender()) >= _bananaFee, "Not enough Banana Token. Use the free faucet.");
        uint256 _oldBalanceOf = bananaToken.balanceOf(address(this));
        // sends fee to this contract
        bananaToken.transferFrom(_msgSender(), address(this), _bananaFee);
        // validates that contract received the fees
        assert(bananaToken.balanceOf(address(this)) == _oldBalanceOf + _bananaFee);

        // _msgSender() needs to be owner of both crypto monkeys
        require(ownerOf(_parent1Id) == _msgSender() && ownerOf(_parent2Id) == _msgSender(), "MonkeyContract: Must be owner of both parent tokens");
       
        // calculating new DNA string from two NFT parents' genes
        uint256 _parent1genes = allMonkeysArray[_parent1Id].genes;         
        uint256 _parent2genes = allMonkeysArray[_parent2Id].genes;       
        uint256 _newDna = _mixDna(_parent1genes, _parent2genes);

        // calculates generation 
        uint256 _newGeneration = _calcGeneration(_parent1Id, _parent2Id);

        // creating new monkey, receiving Token ID from _createMonkey function
        uint256 newMonkeyId = _createMonkey(_parent1Id, _parent2Id, _newGeneration, _newDna, _msgSender());                       

        // emitting breeding event
        emit BreedingSuccessful(
            newMonkeyId,
            allMonkeysArray[newMonkeyId].genes,
            allMonkeysArray[newMonkeyId].birthtime,
            allMonkeysArray[newMonkeyId].parent1Id,
            allMonkeysArray[newMonkeyId].parent2Id,
            allMonkeysArray[newMonkeyId].generation,
            _msgSender()
        ); 

        // this is the Token ID for the new NFT
        return newMonkeyId;
    }

    /**
    * @dev Returns a binary between 00000000-11111111
    */
    function _getRandom() internal view returns (uint8) {
        return uint8(block.timestamp % 255);
    } 
    
    // will generate a pseudo random number and from that decide whether to take a two-digit pair of genes from _parent1genes or _parent2genes, repeated for 7 pairs (8th pair is pseudoRandomAdv, put in front)
    function _mixDna (uint256 _parent1genes, uint256 _parent2genes) internal view returns (uint256) {
        uint256[8] memory _geneArray;
        uint8 _random = uint8(_getRandom());
        // index position for 2 digits during 7 loops, _geneArray[7]-_geneArray[1]
        uint256 countdown = 7;

        // Bitshift: move to next binary bit, 7 loops
        for (uint256 i = 1; i <= 64; i = i * 2) {
        // Then add 2 last digits from the dna to the new dna
        if (_random & i != 0) {
            _geneArray[countdown] = uint8(_parent1genes % 100);
        } else {
            _geneArray[countdown] = uint8(_parent2genes % 100);
        }
        //each loop, take off the last 2 digits from the genes number string
        _parent1genes = _parent1genes / 100;
        _parent2genes = _parent2genes / 100;

        countdown = countdown.sub(1);
        }

        // creating a pseudo random number and including them in the new DNA, so that it has some unique elements
        uint256 pseudoRandomAdv = uint256(keccak256(abi.encodePacked(uint256(_random), totalSupply(), allMonkeysArray[0].genes)));  
        // makes this number a 2 digit number between 10-98 (largest result of %89 is 88)
        pseudoRandomAdv = (pseudoRandomAdv % 89) + 10;
        // setting first 2 digits in DNA string to this new 2 digit number
        _geneArray[0] = pseudoRandomAdv;

        uint256 newGeneSequence;        
        
        // puts in last positioned array entry (2 digits) as first numbers, then adds 00, then adds again,
        // therefore reversing the backwards information in the array again to correct order 
        for (uint256 j = 0; j < 8; j++) {
            newGeneSequence = newGeneSequence + _geneArray[j];

            // will stop adding zeros after last repetition
            if (j != 7)  {
                newGeneSequence = newGeneSequence * 100;
            }                
        }

        return newGeneSequence;      
    }

    // calculates generation of newly bred NFTs
    function _calcGeneration (uint256 _parent1Id, uint256 _parent2Id) internal view returns(uint256) {        

        uint256 _generationOfParent1 = allMonkeysArray[_parent1Id].generation; 
        uint256 _generationOfParent2 = allMonkeysArray[_parent2Id].generation; 

        require(_generationOfParent1 < 1000 && _generationOfParent2 < 1000, "Parents cannot breed above gen999");

        // if both parents have same gen, child will be parents' gen+1  

        // if they have different gen, new gen is average of parents gen plus 2
        // for ex. 1 + 5 = 6, 6/2 = 3, 3+2 = 5, newGeneration would be 5

        // rounding numbers down if odd: 
        // for ex. 1+2=3, 3*10 = 30, 30/2 = 15
        // 15 % 10 = 5, 5>0, 15-5=10
        // 10 / 10 = 1, 1+2 = 3
        // newGeneration = 3       

        uint256 newGeneration;

        if (_generationOfParent1 != _generationOfParent2) {
            uint256 _roundingNumbers = (((_generationOfParent1 + _generationOfParent2) * 10) / 2); 
            if (_roundingNumbers % 10 > 0) {
                _roundingNumbers - 5;      
            }
            newGeneration = (_roundingNumbers / 10 ) + 2;            
        }
        
        else {
            newGeneration = ((_generationOfParent1 + _generationOfParent2) / 2) + 1;              
        }

        return newGeneration;
    }

    // overriding ERC721's function, including whenNotPaused for added security
    function transferFrom(address from, address to, uint256 tokenId) public override whenNotPaused {
        // if market is connected, check if this token to be transferred is on sale at the moment.    
        if ( _marketConnected == true ) {
            bool tokenOnSale = _monkeyMarketInterface.isTokenOnSale(tokenId);
            require( tokenOnSale != true, "MonkeyContract: NFT is still on sale. Remove offer first." );
        }
        
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");

        _transfer(from, to, tokenId);
    }

    // overriding ERC721's function, including whenNotPaused for added security
    function safeTransferFrom(address from, address to, uint256 tokenId) public override whenNotPaused {
        // if market is connected, check if this token to be transferred is on sale at the moment.   
        if ( _marketConnected == true ) {
             bool tokenOnSale = _monkeyMarketInterface.isTokenOnSale(tokenId);
            require( tokenOnSale != true, "MonkeyContract: NFT is still on sale. Remove offer first." );
        }
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");        
        safeTransferFrom(from, to, tokenId, "");
    }

    // overriding ERC721's function, including whenNotPaused for added security
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public override whenNotPaused {
        // if market is connected, check if this token to be transferred is on sale at the moment.        
        if ( _marketConnected == true ) {
            bool tokenOnSale = _monkeyMarketInterface.isTokenOnSale(tokenId);    
            require( tokenOnSale != true, "MonkeyContract: NFT is still on sale. Remove offer first." );
        }
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
        _safeTransfer(from, to, tokenId, _data);
    }
    
}



   