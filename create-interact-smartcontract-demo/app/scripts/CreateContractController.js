(function(){
    var app = angular.module("contract-demo");
    
    var CreateContractController = function ($scope, blockchainInteraction) {
        $scope.submitContract = function (contractName, partyA, partyB) {
            var contractAddress = "1234";
            blockchainInteraction.createContract(contractName, partyA, partyB);
        }
    };

    app.controller("CreateContractController", CreateContractController);
}());