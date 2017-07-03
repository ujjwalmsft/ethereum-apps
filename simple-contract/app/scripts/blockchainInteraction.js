(function () {
    var blockchainInteraction = function ($http, $log, databaseInteraction) {       
        // Checking if Web3 has been injected by the browser (Mist/MetaMask)
        if (typeof web3 !== 'undefined') {
            console.log("Metamask!");
            web3 = new Web3(web3.currentProvider);
        } else {
            console.log("No Metamask!");
            web3 = new Web3(new Web3.providers.HttpProvider("xxx:8545"));
        }
        

        var abi = [{ "constant": false, "inputs": [], "name": "killContract", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "getStateOfSettlement", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "state", "type": "bool" }], "name": "changeStateOfSettlement", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "settlement", "outputs": [], "payable": false, "type": "function" }, { "inputs": [], "payable": false, "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "message", "type": "string" }, { "indexed": false, "name": "creator", "type": "address" }, { "indexed": false, "name": "stateOfSettlement", "type": "bool" }], "name": "ContractCreated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "message", "type": "string" }, { "indexed": false, "name": "caller", "type": "address" }, { "indexed": false, "name": "stateOfSettlement", "type": "bool" }], "name": "ContractSettled", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "message", "type": "string" }, { "indexed": false, "name": "addressOfTheContract", "type": "address" }, { "indexed": false, "name": "stateOfSettlement", "type": "bool" }], "name": "StateChange", "type": "event" }];
        var byteCode = '6060604052341561000c57fe5b5b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506000600060146101000a81548160ff0219169083151502179055507f373bd28d054eaf693831cdae747368bf9813de325a417343cb38b115cc82e104600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600060149054906101000a900460ff1660405180806020018473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183151515158152602001828103825260118152602001807f436f6e7472616374206372656174656421000000000000000000000000000000815250602001935050505060405180910390a15b5b610364806101536000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680631c02708d1461005c57806326d22d891461006e5780634198c31f1461009857806351160630146100ba575bfe5b341561006457fe5b61006c6100cc565b005b341561007657fe5b61007e6100e7565b604051808215151515815260200191505060405180910390f35b34156100a057fe5b6100b8600480803515159060200190919050506100ff565b005b34156100c257fe5b6100ca610241565b005b3373ffffffffffffffffffffffffffffffffffffffff16ff5b565b6000600060149054906101000a900460ff1690505b90565b60011515811515141561012c576001600060146101000a81548160ff021916908315150217905550610160565b600015158115151415610159576000600060146101000a81548160ff02191690831515021790555061015f565b60006000fd5b5b7ffd5630ec3c3231938c46a4bd90b4e600e0323be4bc776922c14e1fa4aabe972830600060149054906101000a900460ff1660405180806020018473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001831515151581526020018281038252602b8152602001807f546865207374617465206f662074686520636f6e74726163742068617320626581526020017f656e206368616e67656421000000000000000000000000000000000000000000815250604001935050505060405180910390a15b50565b60011515600060149054906101000a900460ff16151514156102635760006000fd5b6001600060146101000a81548160ff0219169083151502179055507ff506a1e2e8cd68ada84018130e81519ac4b1acf25fc3c87e5341721e6cc8514533600060149054906101000a900460ff1660405180806020018473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183151515158152602001828103825260118152602001807f436f6e747261637420736574746c656421000000000000000000000000000000815250602001935050505060405180910390a15b5600a165627a7a723058207a03e0eded267bed40c245e3c587ad63da19f4bd918b9b37a44a11359175a7f60029';

        var getStateOfSettlement = function (contractAddress) {
            var contract = web3.eth.contract(abi).at(contractAddress);
            contract.getStateOfSettlement.call(function (error, result) {
                if (!error) {
                    console.log(result);
                };
            });
        };        

        var createContract = function (contractName, partyA, partyB) {
            console.log("createContract");
            var account = web3.eth.accounts[0];
            var code = '0x' + byteCode;
            var SimpleContract = web3.eth.contract(abi);
            SimpleContract.new({ data: code, from: account }, function (err, contract) {
                if (!err) {
                    if (!contract.address) {
                        console.log(contract.transactionHash);
                    } else {
                        var contractAddress = contract.address;
                        console.log(contractAddress);
                        databaseInteraction.addContract(contractName, contractAddress, partyA, partyB).then(function (response) {
                            console.log(response);
                        })
                    }
                }
                else {
                    console.log(err);
                }
            });
        };

        var settleContract = function (contractAddress) {
            var contract = web3.eth.contract(abi).at(contractAddress);
            var account = web3.eth.accounts[0];
            contract.settlement.sendTransaction({ from: account }, function (error, txHash) {
                console.log(txHash);
                waitBlock(txHash, contractAddress);
            });
        };

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async function waitBlock(transactionHash, contractAddress) {
            while (true) {
                var receipt;
                web3.eth.getTransactionReceipt(transactionHash, function (err, txReceipt) {
                    console.log(txReceipt);
                    receipt = txReceipt;
                });
                if (receipt) {
                    databaseInteraction.updateContract(contractAddress, 'true').then(function (result) {
                        console.log(result);
                    });
                    break;
                }
                await sleep(5000);
            }
        };

        return {
            getStateOfSettlement: getStateOfSettlement,
            createContract: createContract,
            settleContract: settleContract
        };
    }

    var module = angular.module("contract-demo");
    module.factory("blockchainInteraction", blockchainInteraction);
}());