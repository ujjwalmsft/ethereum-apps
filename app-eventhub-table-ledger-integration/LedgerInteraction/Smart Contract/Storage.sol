pragma solidity ^0.4.9;

contract Storage {
    /*
    * @title Storage
    * @author Dr. Dolittle
    * @notice This contract provides the storage functionality via a mapping of hashes to timestamps
    */

    // Mapping from hashes to timestamps
    mapping(string => string) private hashProof;

    function Storage () public { }

    function storeHash(string hashVal, string timestap) public {
        hashProof[hashVal] = timestap;
    }

    function getHashProof(string hashVal) public returns (string) {
        return hashProof[hashVal];
    }
}