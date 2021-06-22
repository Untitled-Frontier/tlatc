// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/*
A contract specifically to test that toUint8 generates the right numbers so that all permutations 
are properly possible
*/

contract uint8Tester {

    function divide(bytes memory _bytes, uint256 nr_) public pure returns (uint256) {
        return toUint8(_bytes, 0)/nr_;
    }

    // helper function for generation
    // from: https://github.com/GNSPS/solidity-bytes-utils/blob/master/contracts/BytesLib.sol 
    function toUint8(bytes memory _bytes, uint256 _start) public pure returns (uint8) {
        require(_start + 1 >= _start, "toUint8_overflow");
        require(_bytes.length >= _start + 1 , "toUint8_outOfBounds");
        uint8 tempUint;

        assembly {
            tempUint := mload(add(add(_bytes, 0x1), _start))
        }
        return tempUint;
    }
}