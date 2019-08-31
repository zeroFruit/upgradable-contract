pragma solidity ^0.5.8;

import "./Storage.sol";

contract Machine {
    // Position of calculateResult is important!
    // calculateResult's storage pointer should be matched
    // with Calculator's.
    //
    // So that Calculator contract can override Machine storage.
    uint256 public calculateResult;
    
    address public user;
    
    Storage public s;
    
    event AddedValuesByDelegateCall(uint256 a, uint256 b, bool success);
    event AddedValuesByCall(uint256 a, uint256 b, bool success);
    
    constructor(Storage addr) public {
        s = addr;
        calculateResult = 0;
    }
    
    function saveValue(uint x) public returns (bool) {
        s.setValue(x);
        return true;
    }
    function getValue() public view returns (uint) {
        return s.val();
    }
    
    function addValuesWithDelegateCall(address calculator, uint256 a, uint256 b) public returns (uint256) {
        (bool success, bytes memory result) = calculator.delegatecall(abi.encodeWithSignature("add(uint256,uint256)", a, b));
        emit AddedValuesByDelegateCall(a, b, success);
        return abi.decode(result, (uint256));
    }
    
    function addValuesWithCall(address calculator, uint256 a, uint256 b) public returns (uint256) {
        (bool success, bytes memory result) = calculator.call(abi.encodeWithSignature("add(uint256,uint256)", a, b));
        emit AddedValuesByCall(a, b, success);
        return abi.decode(result, (uint256));
    }
}
