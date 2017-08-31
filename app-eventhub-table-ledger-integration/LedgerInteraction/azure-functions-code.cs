#r "Newtonsoft.Json"
#r "System.Numerics"
#r "System.Runtime.Numerics"
#r ".\bin\Nethereum.Portable.dll"

using System;
using System.Threading;
using System.Threading.Tasks;
using System.Numerics;
using Newtonsoft.Json;
using Nethereum.Geth;
using Nethereum.Web3;

public static async Task Run(string myEventHubMessage, ICollector<tableObject> tableBinding, TraceWriter log)
{
    log.Info($"C# Event Hub trigger function processed a message: {myEventHubMessage}");
    
    dynamic responseJSON = JsonConvert.DeserializeObject(myEventHubMessage);

    string currencyVal = responseJSON[0].id;
    string price_eurVal = responseJSON[0].price_eur;
    string timestampVal = responseJSON[0].timestamp;
    string hashVal = responseJSON[0].hash;

    tableBinding.Add(
        new tableObject()
        {
            PartitionKey = Guid.NewGuid().ToString(),
            RowKey = Guid.NewGuid().ToString(),
            Currency = currencyVal,
            Price = price_eurVal,
            Time = timestampVal,
            Hash = hashVal
        }
    );

    await EthereumInteraction(hashVal, timestampVal, log);
}

public static async Task EthereumInteraction(string hashVal, string timestamp, TraceWriter log)
{
    var privateKey = "a8b3fa261ba3f2dea9042f7e0720db9c2ddd2f379cc4af1a9a9b251d9fba5071";
    var publicKey = "0x82780b64f40cb4fec3e450591e692375bd30a561";

    var contractAddress = "0x319d34e6495e0116513a10829f6c03ff76e89d01";
    var abi = @"[{ ""constant"":false,""inputs"":[{""name"":""hashVal"",""type"":""string""},{""name"":""timestap"",""type"":""string""}],""name"":""storeHash"",""outputs"":[],""payable"":false,""stateMutability"":""nonpayable"",""type"":""function""},{""constant"":false,""inputs"":[{""name"":""hashVal"",""type"":""string""}],""name"":""getHashProof"",""outputs"":[{""name"":"""",""type"":""string""}],""payable"":false,""stateMutability"":""nonpayable"",""type"":""function""},{""inputs"":[],""payable"":false,""stateMutability"":""nonpayable"",""type"":""constructor""}]";

    var web3 = new Web3("http://ethprao7p.westeurope.cloudapp.azure.com:8545");

    var contract = web3.Eth.GetContract(abi, contractAddress);

    // Send Transaction
    var txCount = await web3.Eth.Transactions.GetTransactionCount.SendRequestAsync(publicKey);
    var storeHash = contract.GetFunction("storeHash");
    var storeHashData = storeHash.GetData(hashVal, timestamp);
    var encodedTransaction = Web3Geth.OfflineTransactionSigner.SignTransaction(privateKey, contractAddress, 0, txCount, 1000000000000L, 900000, storeHashData);
    var transactionHash = await web3.Eth.Transactions.SendRawTransaction.SendRequestAsync(encodedTransaction);

    var transactionReceipt = await web3.Eth.Transactions.GetTransactionReceipt.SendRequestAsync(transactionHash);
    while (transactionReceipt == null)
    {
        Thread.Sleep(1000);
        transactionReceipt = await web3.Eth.Transactions.GetTransactionReceipt.SendRequestAsync(transactionHash);
        log.Info("Waiting");
    }

    // Check if the values have been stored
    var getHashProof = contract.GetFunction("getHashProof");
    string result = await getHashProof.CallAsync<string>(hashVal);

    log.Info($"Value: {result}"); 
}


public class tableObject
{
    public string PartitionKey { get; set; }

    public string RowKey { get; set; }

    public string Time { get; set; }

    public string Currency { get; set; }

    public string Price { get; set; }

    public string Hash { get; set; }
}