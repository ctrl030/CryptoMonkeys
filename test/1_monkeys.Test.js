// Unit testing

const MonkeyContract = artifacts.require("MonkeyContract");

contract("MonkeyContract", accounts => {

  // Global variables
  let testInstance;

  // Before all tests
  // could also be beforeEach, to start a fresh blockchain for each test
  before(async()=> {
    testInstance = await MonkeyContract.new();
  }) 

  // Group of tests
  describe("First group of tests", () => {

    // Actual test 1
    it("GEN0_Limit should be 12", async() => {  
      const limit = await testInstance.GEN0_Limit();

      console.log("GEN0_Limit is", Number(limit));
      assert.equal(limit, 12); 

    });

    
    // Actual test 2
    it("name should be Crypto Monkeys", async() => {  
      const name = await testInstance.name();

      // Comparing, i.e. testing 
      assert.equal(name, "Crypto Monkeys")
       
    });

    
    // Actual test 3
    it("should create a monkey", async() => {  
      await testInstance.createGen0Monkey(1214131177989271, {from: accounts[0]});

      const testingMonkeyNr4Pos3 = await testInstance.getMonkeyDetails(3);

      console.log("accounts[0] is", accounts[0])    

      console.log("testingMonkeyNr4Pos3.owner is", testingMonkeyNr4Pos3.owner);
      
      // When not only console logging, but comparing, i.e. testing, use: 
      // assert.equal(testingMonkey1, "")

    });
    
    // Actual test 4
    it("should console.log the totalSupply", async() => {  
      const totalSupplytesting1 = await testInstance.totalSupply();

      // Console logging 
      console.log("totalSupplytesting1 is", Number(totalSupplytesting1));
      
      // When not only console logging, but comparing, i.e. testing, use: 
      //assert.equal(_totalSupplytesting1, "")

    });

   
    // Actual test 5
    it("accounts[0] should give accounts[1] operator status", async() => {  

      // Giving operator status 
      await testInstance.setApprovalForAll(accounts[1], true, {
              

        from: accounts[0],
      });

      const operatorApprovalTesting = await testInstance.isApprovedForAll(accounts[0], accounts[1]);

      // Console logging 
      console.log("operator status for accounts[1] (i.e. 2nd account) is:", operatorApprovalTesting);
  
      assert.equal(operatorApprovalTesting, true);

      /* trying to directly query variable, fails atm xxx
        const operatorApprovalTesting = await testInstance.operatorApprovalsMapping[accounts[0]][accounts[1]];
        // Console logging 
        console.log("operator status for accounts[1] (i.e. 2nd account) is:", operatorApprovalTesting);
      */
      // booleans can be evaluated directly as true/ false, i.e. 0/1 
      // assert.equal(operatorApprovalTesting);

    });

  
    // Actual test 6
    it("accounts[0] should take operator status away from accounts[1]", async() => {  
      await testInstance.setApprovalForAll(accounts[1], false, {
        from: accounts[0],
      });
      
      const operatorApprovalTesting = await testInstance.isApprovedForAll(accounts[0], accounts[1]);
      
      // Console logging 
      console.log("operator status for accounts[1] (i.e. 2nd account) is:", operatorApprovalTesting);    
      
      assert.equal(operatorApprovalTesting, false);

    });

    

    // Actual test 7
    it("accounts[0] should give accounts[1] operator status again", async() => { 
      // Giving operator status 
      await testInstance.setApprovalForAll(accounts[1], true, { 
        from: accounts[0],
      });

      const operatorApprovalTesting = await testInstance.isApprovedForAll(accounts[0], accounts[1]);

      // Console logging 
      console.log("operator status for accounts[1] (i.e. 2nd account) is:", operatorApprovalTesting);

      assert.equal(operatorApprovalTesting, true);
    });


    // Actual test 8 
    it("checking operator status by calling isApprovedForAll function", async() => { 

      // calling isApprovedForAll, saving response isApprovedTestingAnswer 
      // first variable is owner, second operator 
      const isApprovedTestingAnswer =  await testInstance.isApprovedForAll(accounts[0], accounts[1]);

      // Console logging 
      console.log("isApprovedTestingAnswer: ", isApprovedTestingAnswer);

      assert.equal(isApprovedTestingAnswer, true);

    });

     
    // Actual test 9
    it("as operator, accounts[1] should transfer a crypto monkey to accounts[2]", async() => {  
      await testInstance.transfer(accounts[2], 3, { 
        from: accounts[1],
      });

      const testingMonkeyNr4Pos3 = await testInstance.getMonkeyDetails(3);

      console.log("accounts[2] is", accounts[2])    

      console.log("testingMonkeyNr4Pos3.owner is", testingMonkeyNr4Pos3.owner);

      assert.equal(testingMonkeyNr4Pos3.owner, accounts[2]);
    });

    
    // Actual test 10
    it("accounts[2] should give allowance for specific tokenId to accounts[3]", async() => {  
      await testInstance.approve(accounts[3], 3, { 
        from: accounts[2],
      });

      const testingMonkeyNr4Pos3 = await testInstance.getMonkeyDetails(3);

      console.log("accounts[3] is", accounts[3]) 
      console.log("testingMonkeyNr4Pos3.approvedAddress is", testingMonkeyNr4Pos3.approvedAddress);

      assert.equal(testingMonkeyNr4Pos3.approvedAddress, accounts[3]);

    });

    // Actual test 11
    it("calling getApproved", async() => { 

      const testingAllowedAddressForMonkeyId3 = await testInstance.getApproved(3);

      console.log("accounts[3] is", testingAllowedAddressForMonkeyId3) 

      assert.equal(testingAllowedAddressForMonkeyId3, accounts[3]);

    });


    
    // Actual test 12
    it("accounts[3] should take that crypto monkey", async() => {       
      await testInstance.transfer(accounts[3], 3, { 
        from: accounts[3],
      });

      const testingMonkeyNr4Pos3 = await testInstance.getMonkeyDetails(3);

      console.log("accounts[3] is", accounts[3]) 
      console.log("testingMonkeyNr4Pos3.owner is", testingMonkeyNr4Pos3.owner);

      assert.equal(testingMonkeyNr4Pos3.owner, accounts[3]);

    });

    /*
    // Actual test 11
    it("get past events and see it went right", async() => {  
      await testInstance.transfer(accounts[3], 3, { 
        from: accounts[3],
      });


      const testingMonkeyNr4Pos3 = await testInstance.getMonkeyDetails(3);

      console.log("accounts[4] is", accounts[3]) 
      console.log("accounts[4] is", accounts[4])    

      console.log("testingMonkeyNr4Pos3.owner is", testingMonkeyNr4Pos3.owner);

    });
    */



    

    /* failing atm - reason: can't console log array of structs / objects. 
    // Actual test 4
    it("should console.log the allMonkeysArray", async() => {  
      const allMonkeysArraytesting1 = await testInstance.allMonkeysArray();
      console.log("allMonkeysArraytesting1 is", allMonkeysArraytesting1);
      
      //assert.equal(allMonkeysArraytesting1, "")

    });
    */
   
  })  
  
});