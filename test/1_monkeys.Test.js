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
      assert.equal(name, "Crypto Monkeys")
       
    });

    
    // Actual test 3
    it("should create a monkey", async() => {  
      const testingMonkey1 = await testInstance.createGen0Monkey(1214131177989271);
      console.log("testingMonkey1 is", testingMonkey1);
      
      //assert.equal(testingMonkey1, "")

    });
    
    // Actual test 4
    it("should console.log the totalSupply", async() => {  
      const totalSupplytesting1 = await testInstance.totalSupply();
      console.log("totalSupplytesting1 is", Number(totalSupplytesting1));
      
      //assert.equal(_totalSupplytesting1, "")

    });



    

    /* failing atm
    // Actual test 4
    it("should console.log the allMonkeysArray", async() => {  
      const allMonkeysArraytesting1 = await testInstance.allMonkeysArray();
      console.log("allMonkeysArraytesting1 is", allMonkeysArraytesting1);
      
      //assert.equal(allMonkeysArraytesting1, "")

    });
    */


    /*
    // Actual test 5
    it("should create a monkey", async() => {  
      

    });
    */
   
  })


  
  
});