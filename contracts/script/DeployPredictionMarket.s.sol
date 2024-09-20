// SPDX-License-Identifier: UNLICENSED
   pragma solidity ^0.8.20;

   import "forge-std/Script.sol";
   import "../src/PredictionMarket.sol";

   contract DeployPredictionMarket is Script {
       function setUp() public {}

       function run() public {
           uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
           vm.startBroadcast(deployerPrivateKey);

           // Deploy MockedUSDC
           MockedUSDC usdc = new MockedUSDC();

           // Deploy PredictionMarket
           PredictionMarket predictionMarket = new PredictionMarket(address(usdc));

           vm.stopBroadcast();
       }
   }