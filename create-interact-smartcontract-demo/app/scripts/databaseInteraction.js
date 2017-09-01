(function () {
    var databaseInteraction = function ($http, $log) {
        var getContracts = function () {
            return $http.post("http://meetup-eth.azurewebsites.net/api/getRecords")
                .then(function (response) {
                    return response.data;
                })
        };
        
        var addContract = function (contractName, contractAddress, partyA, partyB) {
            var query = "http://meetup-eth.azurewebsites.net/api/addRecord/" + contractName + "/" + contractAddress + "/" + partyA + "/" + partyB;
            return $http.post(query)
                .then(function (response) {
                    return response;
                })
        };

        var updateContract = function (contractAddress, settlementStatus) {
            return $http.post("http://meetup-eth.azurewebsites.net/api/updateRecord/" + contractAddress + "/" + settlementStatus)
                .then(function (response) {
                    return response;
                })
        };

        var deleteContract = function (contractAddress) {
            return $http.post("http://meetup-eth.azurewebsites.net/api/deleteRecord/" + contractAddress)
                .then(function (response) {
                    return response;
                })
        };

        return {
            getContracts: getContracts,
            addContract: addContract,
            updateContract: updateContract,
            deleteContract: deleteContract
        };
    }

    var module = angular.module("contract-demo");
    module.factory("databaseInteraction", databaseInteraction);
}());