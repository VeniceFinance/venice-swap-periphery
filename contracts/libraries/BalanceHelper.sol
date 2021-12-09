// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0;

// helper methods for interacting with ERC20 tokens and sending ETH that do not consistently return true/false
library BalanceHelper {

    function safeBalanceOf(address token, address owner) internal view returns (uint){
        // bytes4(keccak256(bytes('balanceOf(address)')));
        (bool success, bytes memory data) = token.staticcall(abi.encodeWithSelector(0x70a08231, owner));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'TransferHelper: BALANCE_OF_FAILED');
        (uint balance) = abi.decode(data, (uint));
        return balance;
    }
}