// Imports
const { ethers } = require("hardhat");
const hre = require("hardhat");
require("dotenv").config({ path: ".env" });
var TOKEN_CONTRACT = require("../artifacts/contracts/Token.sol/Token.json");
var VAULT_CONTRACT = require("../artifacts/contracts/Vault.sol/Vault.json");

// Env variables
const TOKEN_CONTRACT_ADDRESS = process.env.TOKEN_CONTRACT_ADDRESS;
const VAULT_CONTRACT_ADDRESS = process.env.VAULT_CONTRACT_ADDRESS;

async function main() {


  //                Contract Deployment
  // [owner, signer1, signer2, signer3] = await ethers.getSigners();
  // const tokenFactory = await hre.ethers.getContractFactory("Token");
  // const initialSupply = ethers.utils.parseEther("1000");

  // token = await tokenFactory.deploy(initialSupply)
  // await token.deployed()
  // console.log(`Token deployed to ${token.address}`);

  // const vaultFactory = await hre.ethers.getContractFactory("Vault");
  // vault = await vaultFactory.deploy(token.address);
  // await vault.deployed();
  // console.log(`Vault deployed to ${vault.address}`);
  

  const [owner, signer1, signer2 ] = await ethers.getSigners()
  console.log("Contract Deployment Addresses")
  console.log("Owner address : ", owner.address)
  console.log("Signer1 address : ", signer1.address)
  console.log("Signer2 address : ", signer2.address)

  const token = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT.abi, owner)
  const vault = new ethers.Contract(VAULT_CONTRACT_ADDRESS, VAULT_CONTRACT.abi, owner)
  console.log("Token deployed to : ", token.address);
  console.log("Vault deployed to : ", vault.address)
  console.log("-----------------------------------")

  await verifyAssetAndShares(vault, token)
  await mintAssetsToAccounts(token, signer1, signer2)
  await depositAssetsIntoVault(vault, token, signer1)
  await mintSharesFromVault(vault, token, signer2)
  await withdrawAssetsFromVault(vault, token, signer1)
  await redeemSharesFromVault(vault, token, signer2)
}

async function verifyAssetAndShares (vault, token) {
  const assetName = await token.name()
  const assetSymbol = await token.symbol()
  const shareTokenName = await vault.name()
  const shareTokenSymbol = await vault.symbol()
  const shareTokenDecimal = await vault.decimals()
  const initialAssets = await vault.totalAssets()

  console.log("ERC4626 Vault Overview")
  console.log("Underlying Asset name: ", assetName);
  console.log("Underlying Asset symbol: ", assetSymbol);
  console.log("Vault Shares: ", shareTokenName);
  console.log("Vault Shares symbol: ", shareTokenSymbol);
  console.log("Vault Shares decimal: ", shareTokenDecimal);
  console.log("Initial Assets in Vault: ", Number(initialAssets) / 10**18);
  console.log("-----------------------------------")
}

async function mintAssetsToAccounts(token, signer1, signer2) {
  const transferAmount = ethers.utils.parseEther("10");
  const transfer1 = await token.transfer(signer1.address, transferAmount);
  const transfer2 = await token.transfer(signer2.address, transferAmount);
  console.log("Transfer txn hash: ", transfer1.hash)
  console.log("Transfer txn hash: ", transfer2.hash)

  const signer1Balance = await token.balanceOf(signer1.address);
  const signer2Balance = await token.balanceOf(signer2.address);

  console.log("Underlying Assets overview")
  console.log(`Account ${signer1.address} BTN balance : `, Number(signer1Balance) / 10**18);
  console.log(`Account ${signer2.address} BTN balance : `, Number(signer2Balance) / 10**18);
  console.log("-----------------------------------")
}

async function depositAssetsIntoVault(vault, token, signer1) {
  console.log(`Account ${signer1.address} calling deposit() function`);
  
  // Approve vault contract to transfer underlying token from signer
  const approveTransaction = await token.connect(signer1).approve(vault.address, ethers.utils.parseEther("10"));
  console.log("Approve txn hash: ", approveTransaction.hash)
  const depositTransaction = await vault.connect(signer1).deposit(ethers.utils.parseEther("10"), signer1.address)
  console.log("Deposit txn hash: ", depositTransaction.hash)

  const signer1Balance = await token.balanceOf(signer1.address);
  const signer1Share = await vault.balanceOf(signer1.address)
  const vaultBalance = await vault.totalAssets()
  const sharesMinted = await vault.totalSupply()

  console.log(`Account ${signer1.address} BTN balance : `, Number(signer1Balance)/ 10**18);
  console.log(`Account ${signer1.address} Share balance : `, Number(signer1Share)/ 10**18);
  console.log("Vault Asset balance : ", Number(vaultBalance) / 10**18)
  console.log("Total Shares minted: ", Number(sharesMinted) / 10**18)
  console.log("-----------------------------------")
}

async function mintSharesFromVault(vault, token, signer2) {
  console.log(`Account ${signer2.address} calling mint() function`);

  // Approve vault contract to transfer underlying token from signer
  const approveTransaction = await token.connect(signer2).approve(vault.address, ethers.utils.parseEther("5"));
  console.log("Approve txn hash: ", approveTransaction.hash)
  const mintTransaction = await vault.connect(signer2).mint(ethers.utils.parseEther("5"), signer2.address)
  console.log("Mint txn hash: ", mintTransaction.hash)

  const signer2Balance = await token.balanceOf(signer2.address);
  const signer2Share = await vault.balanceOf(signer2.address)
  const vaultBalance = await vault.totalAssets()
  const sharesMinted = await vault.totalSupply()

  console.log(`Account ${signer2.address} BTN balance : `, Number(signer2Balance) / 10**18);
  console.log(`Account ${signer2.address} Share balance : `, Number(signer2Share) / 10**18);
  console.log("Vault Asset balance : ", Number(vaultBalance) / 10**18)
  console.log("Total Shares minted: ", Number(sharesMinted) / 10**18)
  console.log("-----------------------------------")
}

async function withdrawAssetsFromVault(vault, token, signer1) {
  console.log(`Account ${signer1.address} calling withdraw() function`);
  const withdrawTransaction = await vault.connect(signer1).withdraw(ethers.utils.parseEther("10"), signer1.address, signer1.address)
  console.log("Withdraw txn hash: ", withdrawTransaction.hash)

  const signer1Balance = await token.balanceOf(signer1.address);
  const signer1Share = await vault.balanceOf(signer1.address)
  const vaultBalance = await vault.totalAssets()
  const sharesMinted = await vault.totalSupply()

  console.log(`Account ${signer1.address} BTN balance : `, Number(signer1Balance)/ 10**18);
  console.log(`Account ${signer1.address} Share balance : `, Number(signer1Share)/ 10**18);
  console.log("Vault asset balance : ", Number(vaultBalance) / 10**18)
  console.log("Total Shares minted: ", Number(sharesMinted) / 10**18)
  console.log("-----------------------------------")
}

async function redeemSharesFromVault(vault, token, signer2) {
  console.log(`Account ${signer2.address} calling redeem() function`);
  const redeemTransaction = await vault.connect(signer2).redeem(ethers.utils.parseEther("5"), signer2.address, signer2.address)
  console.log("Redeem txn hash: ", redeemTransaction.hash)

  const signer2Balance = await token.balanceOf(signer2.address);
  const signer2Share = await vault.balanceOf(signer2.address)
  const vaultBalance = await vault.totalAssets()
  const sharesMinted = await vault.totalSupply()

  console.log(`Account ${signer2.address} BTN balance : `, Number(signer2Balance) / 10**18);
  console.log(`Account ${signer2.address} Share balance : `, Number(signer2Share) / 10**18);
  console.log("Vault asset balance : ", Number(vaultBalance) / 10**18)
  console.log("Total Shares minted: ", Number(sharesMinted) / 10**18)
  console.log("-----------------------------------")
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
