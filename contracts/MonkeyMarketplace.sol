pragma solidity ^0.5.12;

import "./Monkeycontract.sol";
import "./Ownable.sol";
import "./IMonkeyMarketplace.sol";
// preparing safemath to rule out over- and underflow  
import "./Safemath.sol";

contract MonkeyMarketplace is Ownable, IMonkeyMarketplace  {
  using SafeMath for uint256;

  MonkeyContract private _monkeycontract;

  struct Offer {
    address payable seller;
    uint256 price;
    uint256 index;
    uint256 tokenId;    
    bool active;
  }

  Offer[] offersArray; 

  mapping (uint256 => Offer) tokenIdToOfferMapping;   

  event MarketTransaction(string TxType, address owner, uint256 tokenId);

  event monkeySold (address seller, address buyer, uint256 priceInGwei, uint256 tokenId);

  event NewOfferCreated (address offerCreatedBy, uint256 tokenId, uint256 price);
  
  /** 
  * Set the current MonkeyContract address and initialize the instance of Monkeycontract.
  * Requirement: Only the contract owner can call.
  */
  function setMonkeyContract(address _newMonkeyContractAddress) external onlyOwner {
   _monkeycontract = MonkeyContract(_newMonkeyContractAddress);
  }

  constructor (address _constructorMonkeyContractAddress) public {
    setMonkeyContract(_constructorMonkeyContractAddress); 
  }

  /**
  * Creates a new offer for _tokenId for the price _price.
  * Emits the MarketTransaction event with txType "Create offer"
  * Requirement: Only the owner of _tokenId can create an offer.
  * Requirement: There can only be one active offer for a token at a time.
  * Requirement: Marketplace contract (this) needs to be an approved operator when the offer is created.
  */    
  function setOffer(uint256 _price, uint256 _tokenId) external {    

    //  Only the owner of _tokenId can create an offer.
    address monkeyOwner = _monkeycontract.ownerOf(_tokenId);
    require( monkeyOwner == msg.sender);

    //Marketplace contract (this) needs to be an approved operator when the offer is created.
    require(_monkeycontract.isApprovedForAll(msg.sender, address(this)), "Marketplace address needs operator status from monkey owner.");
                   
    // There can only be one active offer for a token at a time.    
    if (tokenIdToOfferMapping[_tokenId].active) {
      // delete mapping entry
      delete tokenIdToOfferMapping[_tokenId];
      // delete offer array entry 
      delete offersArray[_tokenId];
    }
    
    // Creating a new offer from the Offer struct "blueprint"
    Offer memory newOffer = Offer({
      seller: msg.sender,
      price: _price,
      tokenId: _tokenId,      
      active: true,
      index: offersArray.length
    });

    // saving new offer (it's a struct) to mapping 
    tokenIdToOfferMapping[_tokenId] = newOffer;    

    offersArray.push(newOffer);

    emit MarketTransaction("Create offer", monkeyOwner, _tokenId);

    emit NewOfferCreated(msg.sender, _tokenId, _price);

  }

  /**
  * Removes an existing offer.
  * Emits the MarketTransaction event with txType "Remove offer"
  * Requirement: Only the seller of _tokenId can remove an offer.
  */
  function removeOffer(uint256 _tokenId) external {

    Offer memory tokenOffer = tokenIdToOfferMapping[_tokenId];

    //  Only the owner of _tokenId can delete an offer.
    require(tokenOffer.seller == msg.sender);    

    // deleting array entry
    delete offersArray[tokenOffer.index];

    // deleting mapping entry
    delete tokenOffer;      

    emit MarketTransaction("Remove offer", msg.sender, _tokenId);
    
  }

  /**
  * Get the details about a offer for _tokenId. Throws an error if there is no active offer for _tokenId.
  */
  function getOffer(uint256 _tokenId) external view returns (address seller, uint256 price, uint256 index, uint256 tokenId, bool active)
  {
    return (
    tokenIdToOfferMapping[_tokenId].seller,
    tokenIdToOfferMapping[_tokenId].price,
    tokenIdToOfferMapping[_tokenId].index, 
    tokenIdToOfferMapping[_tokenId].tokenId,
    tokenIdToOfferMapping[_tokenId].active       
    );
  }

  /**
  * Get all tokenId's that are currently for sale. Returns an empty array if none exist.
  */
  function getAllTokenOnSale() external view returns(uint256[] memory listOfOffers) {
    
    if (offersArray == 0){

      return listOfOffers[];

    }
    else {

      for (uint256 k = 0; k < offersArray.length; k++) {
        if (offersArray[k].active) {
          listOfOffers[(listOfOffers.length + 1)] = offersArray[k].tokenId;
        }         
      }

      return listOfOffers; 

    }
   
  }

  /**
  * Executes the purchase of _tokenId.
  * Sends the funds to the seller and transfers the token using transferFrom in Monkeycontract.
  * Emits the MarketTransaction event with txType "Buy".
  * Requirement: The msg.value needs to equal the price of _tokenId
  * Requirement: There must be an active offer for _tokenId
  */
  function buyMonkey(uint256 _tokenId) external payable {
    
    require(tokenIdToOfferMapping[_tokenId].active == true);

    require(tokenIdToOfferMapping[_tokenId].price == msg.value);

    uint256 _priceInGwei = msg.value * 1000000000;

    address _oldOwner = tokenIdToOfferMapping[_tokenId].seller;

    _monkeycontract.transferFrom(_oldOwner, msg.sender, _tokenId);

    removeOffer(_tokenId);

    emit MarketTransaction("Buy", msg.sender, _tokenId);

    emit monkeySold (_oldOwner, msg.sender, _priceInGwei, _tokenId);

  }

}



    
