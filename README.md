# ERC4626 Vault

This project is a minimal implementation of [OppenZepplin's ERC4626 contract](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/extensions/ERC4626.sol). The contracts involved are deployed onto the Mumbai testnet. 

Hardhat commands for running test cases and deploying code to local network/testnet:
```shell
npx hardhat compile 
npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```
### Deployment
In the deployment script, the Token and Vault contract are deployed in the `main()` function. The Token contract deploys an ERC-20 token that is used as the underlying asset in the vault. This token is minted and distributed to the accounts defined in `await ethers.getSigners()`.

The remain functions in `main()` execute deposit, withdraw, mint and redeem operations in the  deployed vault contract. 

### Environment/ Secret Variables

The following environment variables should be defined in a .env file:
1. QUICKNODE_HTTP_URL - RPC url
1. PRIVATE_KEY- Account with test MATIC for deploying contracts and minting underlying ERC20 asset.
1. PRIVATE_KEY_2- Account with test MATIC for executing vault operations
1. PRIVATE_KEY_3- Account with test MATIC for executing vault operations
1. POLYGONSCAN_API_KEY
1. TOKEN_CONTRACT_ADDRESS- Address of Token contract deployed on testnet
1. VAULT_CONTRACT_ADDRESS- Address of Vault contract deployed on testnet


### Key Functions

 ```shell
deposit(assets, receiver)- user specifies amount of underlying assets to deposit and mints vault shares
mint(shares, receiver)- user deposits underlying assets and specifies amount of vault shares to mint
withdraw(assets, receiver, owner)- user specifies amount of underlying asset to withdraw and burns vault shares
redeem(shares, receiver, owner)- user withdraws underlying asset and specifies amount of vault shares to burn
```
 
 View functions that preview outcomes
 ```shell
previewDeposit(assets)- call convertToShares(assets)
previewMint(shares)- call convertToAssets(shares)
previewWithdraw(assets)- call convertToAssets(shares)
previewRedeem(shares)- call convertToShares(assets)
```

 View functions that show caps
 ```shell
maxDeposit(receiver)- returns type(uint256).max, unless underlying asset is 0 
maxMint(receiver)- return type(uint256).max
maxWithdraw(owner)- returns convertToAssets(balanceOf(owner))
maxRedeem(owner)- return balanceOf(owner)
```
