pragma solidity ^0.4.9;

contract SimpleContract {
    /*
    * @title SimpleContract
    * @author Dr. Dolittle
    * @notice This contract is used for demo purposes
    */

    /*******************************************/
    // State variables
    /*******************************************/
    address creator;
    bool stateOfSettlement;

    /*******************************************/
    // Events
    /*******************************************/
    event ContractCreated (
        string message, 
        address creator,
        bool stateOfSettlement
    );

    event ContractSettled (
        string message, 
        address caller,
        bool stateOfSettlement
    );

    event StateChange (
        string message,
        address addressOfTheContract,
        bool stateOfSettlement
    );

    /*******************************************/
    // Modifiers
    /*******************************************/
    modifier isCreator () {
        if (msg.sender != creator) {
            throw;
        }
        _;
    }

    /*******************************************/
    // Functions
    /*******************************************/
    /**@dev Constructor
      */
    function SimpleContract () {
        creator = msg.sender;
        stateOfSettlement = false;

        ContractCreated (
            "Contract created!",
            creator,
            stateOfSettlement
        );
    }

    /**@dev Get the current state of the settlement
      * True stands for a positive, false for a negative settlement.
      *@return The current state of the settlement
      */
    function getStateOfSettlement () returns (bool) {
        return stateOfSettlement;
    }

    /**@dev Change the state of the settlement
      * True stands for a positive, false for a negative settlement.
      *@param state The to-be state of the settlement
      */
    function changeStateOfSettlement (bool state) {
        if (state == true) {
            stateOfSettlement = true;
        }
        else if (state == false) {
            stateOfSettlement = false;
        }
        else {
            throw;
        }

        StateChange (
            "The state of the contract has been changed!",
            this,
            stateOfSettlement
        );
    }

    /**@dev Settle the contract. 
      * True stands for a positive, false for a negative settlement.
      *@return The final settlement state
      */
    function settlement () {
        if (stateOfSettlement == true) {
            throw;
        }
        stateOfSettlement = true;

        ContractSettled (
            "Contract settled!",
            msg.sender,
            stateOfSettlement
        );
    }

    /**@dev Destroy the contract
      */
    function killContract() {
        selfdestruct(msg.sender);
    }
}