pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

/**
 * @title Compound.
 * @dev Lending & Borrowing.
 */

import {Helpers} from "./helpers.sol";
import {
    TokenInterface,
    ComptrollerLensInterface,
    CompReadInterface,
    OrcaleComp,
    CTokenInterface
} from "./interface.sol";

abstract contract Resolver is Helpers {
    function getPriceInEth(CTokenInterface cToken)
        public
        view
        returns (uint256 priceInETH, uint256 priceInUSD)
    {
        uint256 decimals =
            getCETHAddress() == address(cToken)
                ? 18
                : TokenInterface(cToken.underlying()).decimals();
        uint256 price =
            OrcaleComp(getOracleAddress()).getUnderlyingPrice(address(cToken));
        uint256 ethPrice =
            OrcaleComp(getOracleAddress()).getUnderlyingPrice(getCETHAddress());
        priceInUSD = price / 10**(18 - decimals);
        priceInETH = wdiv(priceInUSD, ethPrice);
    }

    function getCompoundData(address owner, address[] memory cAddress)
        public
        view
        returns (CompData[] memory)
    {
        CompData[] memory tokensData = new CompData[](cAddress.length);
        ComptrollerLensInterface troller = getComptroller();
        for (uint256 i = 0; i < cAddress.length; i++) {
            CTokenInterface cToken = CTokenInterface(cAddress[i]);
            (uint256 priceInETH, uint256 priceInUSD) = getPriceInEth(cToken);
            (, uint256 collateralFactor, bool isComped) =
                troller.markets(address(cToken));
            uint256 _totalBorrowed = cToken.totalBorrows();
            tokensData[i] = CompData(
                priceInETH,
                priceInUSD,
                cToken.exchangeRateStored(),
                cToken.balanceOf(owner),
                cToken.borrowBalanceStored(owner),
                _totalBorrowed,
                add(_totalBorrowed, cToken.getCash()),
                troller.borrowCaps(cAddress[i]),
                cToken.supplyRatePerBlock(),
                cToken.borrowRatePerBlock(),
                collateralFactor,
                troller.compSpeeds(cAddress[i]),
                isComped,
                troller.borrowGuardianPaused(cAddress[i])
            );
        }

        return tokensData;
    }

    function getPosition(address owner, address[] memory cAddress)
        public
        returns (
            CompData[] memory,
            CompReadInterface.CompBalanceMetadataExt memory
        )
    {
        return (
            getCompoundData(owner, cAddress),
            CompReadInterface(getCompReadAddress()).getCompBalanceMetadataExt(
                getCompToken(),
                getComptroller(),
                owner
            )
        );
    }
}

contract InstaCompoundResolver is Resolver {
    string public constant name = "Compound-Resolver-v1.4";
}
