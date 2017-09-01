(function () {
    var app = angular.module("contract-demo");

    var HomeController = function ($scope, databaseInteraction, blockchainInteraction) {
        databaseInteraction.getContracts().then(function (records) {
            $scope.contracts = records;
        });

        $scope.settleContract = function (contractAddress, event) {
            $(event.target).attr("style", "display:none");
            blockchainInteraction.settleContract(contractAddress);
        };
    };

    app.controller("HomeController", HomeController);
}());