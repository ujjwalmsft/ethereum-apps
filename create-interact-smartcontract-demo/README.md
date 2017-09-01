# Getting started

*   Install Visual Studio Code
    *   Install `Solidity` extension

*   Set up an Ethereum instance in Azure

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
	*	The newest version does not work with Ethereum Private Networks in Azure. It is necessary to deploy an older version.
		*	See [Invalid sender error in MetaMask with private network in Azure ethereum BaaS](https://ethereum.stackexchange.com/questions/15592/invalid-sender-error-in-metamask-with-private-network-in-azure-ethereum-baas)
		*	See also [How to install Chrome extensions manually](https://www.cnet.com/how-to/how-to-install-chrome-extensions-manually/)

*   Deploy SQL database in Azure
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

*	Deploy the app

*	Create a new contract

*	Settle the contract

*	...


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

*   Open Truffle connected to the network in Azure
    *   `truffle console --network azure`
    *   `var ref = SimpleContract.deployed()`
    *   `var contractAddress = "0xfac0160b61bb5df9a1c6b1f878e5dca4580fa6842118b39d7521893a1b1cc683"`
    *   `var account0 = "0xd9a6018ca07e5b7f4a5fab661d371f2bdd00294f"`
    *   `var account1 = "0xa42b89f7cd3634092e7cfa0bcb229ffdc6b148d4"`
    *   `var app = SimpleContract.at(contractAddress)`
    *   `app.address`
    *   `app.getStateOfSettlement.call()`
    *   `app.changeStateOfSettlement(true, {from: account1})'`
    *   `app.changeStateOfSettlement(true, {from: account0})'`
    *   `app.getStateOfSettlement.call()`
    *   `app.settlement({from: account0})`
    *   `app.getStateOfSettlement.call()`
    *   `app.changeStateOfSettlement(false, {from: account0})'`
    *   `app.getStateOfSettlement.call()`

## Via the UI

*	Create contract
*	Settle contract