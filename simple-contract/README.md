# Getting started (tested under Windows 10)

*   Install Visual Studio Code
    *   Install `Solidity` extension
    *   Alternatively Visual Studio can be used of course

*   Install Truffle on Ubuntu Bash
    *   Show how to install Ubuntu Bash
    *   [Installation Guide](https://github.com/BlockchainRepos/truffle-testrpc/blob/master/truffle-testrpc-setup/README.md)   

*   Set up an Ethereum instance in Azure
    *   Connect to transcation node and both mining nodes

*   Setup connection to the network in Azure
    *   [Configuration](https://github.com/BlockchainRepos/truffle-testrpc/tree/master/truffle-general)
	*	Adjust the network settings in `./smart-contracts/truffle.js`

*   Deploy a Contract via Truffle and Ubuntu Bash
    *   Go to tx node and unlock coinbase
        *   `geth attach`
        *   `personal.unlockAccount(eth.accounts[0], pwd, 3600)`
    *   `truffle migrate --network azure`

*	Install the Metamask Browser plugin
	*	[Metamask Homepage](https://metamask.io/)
	*	Connect to the private network
	*	Send 1000 Ether to the new account in Metamask via the Adminsite
	*	If you don't use Metamask it is necessary to unlock the account directly on the node you are connected to

*   Deploy SQL database in Azure
    *   Show SQL Management Studio
    *   Allow IP to access in Server firewall
    *   Create table (SQL Server Management Studio)
```
CREATE TABLE [dbo].[Contracts](
    [Id] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY, 
	[ContractName] [varchar](255) NOT NULL,
    [ContractAddress] [varchar](255) NOT NULL,
	[PartyA] [varchar](255) NOT NULL,
	[PartyB] [varchar](255) NOT NULL,
    [SettlementStatus] [varchar](5) NOT NULL
)
```

*	Create an empty web app in Azure

*   Adjust the database access data in `./server.js`

*   Adjust the URL of the app in `./app/scripts/databaseInteraction.js`

*   Adjust the host of the Blockchain instance in `./app/scripts/blockchainInteraction.js`

*   Install the node modules via `npm install <packageName> --save`
    *   express, restify, tedious, util

*	Deploy the app


#	Useful

*   Open one command window connected to mining node and show the mining
    *   Connect to tx node
    *   Connect from the tx to the mn node
        *   Get the IP address from nic-mn0
        *   Show the output
            *   `ps -aux`
            *   `tail -f /proc/<pid>/fd/1`

*   Check a contract via Remix
    *   [Remix](https://ethereum.github.io/browser-solidity/#version=soljson-v0.4.11+commit.68ef5810.js)

*	When installing dependencies for node use `npm install <packageName> --save`


# Demonstrate interaction with the Smart Contract

## Via Truffle

*   Open Truffle connected to the network in Azure in Ubuntu Bash
    *   `truffle console --network azure`
    *   `var ref = SimpleContract.deployed()`
    *   `var contractAddress = "..."`
    *   `var account = "..."`
    *   `var app = SimpleContract.at(contractAddress)`
    *   `app.address`
    *   `app.getStateOfSettlement.call()`
    *   `app.changeStateOfSettlement(true, {from: account})'`
    *   `app.getStateOfSettlement.call()`
    *   `app.settlement({from: account})`
    *   `app.getStateOfSettlement.call()`

## Via UI



# Next steps

*   The demo can be enhanced e.g. by
    *   AD for authentication / authorization
    *   Key Vault for Key Management (together with the AD)
    *   Build a separate API App with API Management to have more control over the API (e.g. control number of accesses, paywall...)
	*   Leverage PowerBI, Machine Learning, Analysis services for post processing and data visualization
	*   …
