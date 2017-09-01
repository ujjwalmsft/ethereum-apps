# Short Description

*   The app fetches the current bitcoin price with some metadata every 30 seconds
    *   A timestamp is generated
    *   The data is hashed
*   The data including the hash and timestamp is send to an Event Hub
*   This triggers a Azure Functions function
    *   All data is stored in an Azure Table
    *   The hash and the timestamp are stored on an Ethereum Ledger instance


# Steps to deploy the solution

## Create the input source
*   In this case it is the MessageCreator app.
*   This app fetches the Bitcoin price every 10 seconds and sends it to the Event Hub.


## Create the Event Hub
*   Follow the instructions to create an Event Hub in Azure
    *   [Create an Event Hub](https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-create)
*   Insert the name and connection string of the event hub after it has been created


## Create the ledger
*   Create a new Ethereum Consortium Instance
*   Connect to the network
*   Check out the version via `geth version`


## Create and deploy the Smart Contract to store the data
*   Create the contract -> see `\EthereumInstance\Storage.sol`
*   Deploy the contract (e.g. via Remix)
    *   Store ABI and address
*   Test the contract
    *   Get the contract -> `var contract = eth.contract(abi).at(address)`
    *   Store a hash -> `contract.storeHash.sendTransaction('hashval1', 'timestamp1', {from: eth.accounts[0]})`
    *   Check if stored -> `contract.getHashProof.call('hashval1')`


## Create function in Azure Functions to build a bridge between the Event Hub and the table and the ledger
*   The idea is to store the messages including a hash of the content in a table, on the ledger only the hash and a timestamp are stored
*   `LedgerInteraction\AzureFunctionsDemo` is the local environment to develop and test. It is the code to used later in the portal
*   Connect to the Azure Table:
    *   Go to `Integrate` and add as output Azure Table Storage
        *   After setting the binding up the `function.json` look similar to `\LedgerDBConnector\function.json`
    *   Adjust the binding variable
*   Connect to the ledger:
    *   Replace the private key and the public key in the Azure Functions function
        *   Get the private key via getting the keystore file from the geth node and import it to `https://www.myetherwallet.com/#view-wallet-info` and provide the password
    *   Replace the URL of the RPC endpoint of the Ethereum instance
    *   Upload the DLLs from `\LedgerInteraction\DLLs` following this [Guide](https://blogs.msdn.microsoft.com/benjaminperkins/2017/04/13/how-to-add-assembly-references-to-an-azure-function-app/)
        *   Upload via Drag'n'Drop
    *   Create function using the code in `\LedgerDBConnector\azure-functions-code.cs`


## Misc
*   `TableInteraction.cs` in `\MessageCreator`is not relevant, just to keep it to know how to approach table interaction in the future.


# To Test
*   Start the MessageCreator Application
*   Run the Azure Function functions
*   Check log in Azure Functions
*   Use [Azure Storage Explorer](https://azure.microsoft.com/en-us/features/storage-explorer/) to check if entries are inserted to the table