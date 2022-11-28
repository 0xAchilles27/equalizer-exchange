const { loadFixture} = require("@nomicfoundation/hardhat-network-helpers");
const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
// import "@openzeppelin/contracts/interfaces/IERC20"
  
  describe("Vault", function () {

    async function deployVault() {

      // Contracts are deployed using the first signer/account by default
      const [owner, signer1, signer2, signer3] = await ethers.getSigners();

      const tokenFactory = await ethers.getContractFactory("Token");
      const initialSupply = ethers.utils.parseEther("1000");
      const token = await tokenFactory.deploy(initialSupply)
      const underlyingAsset = token.address;
  
      const vaultFactory = await ethers.getContractFactory("Vault");
      const vault = await vaultFactory.deploy(underlyingAsset);

      console.log("Base Token deployed to : ", underlyingAsset);
      console.log("Vault Contract deployed to : ", vault.address);
  
      return { vault, token, underlyingAsset, owner, signer1, signer2, signer3 };
    }
  
    describe("Deployment", function () {

      it("Should set the right underlying asset", async function () {
        const { vault, underlyingAsset } = await loadFixture(deployVault);
        expect(await vault.asset()).to.equal(underlyingAsset);
      });
  
      it("Should set the right decimals", async function () {
        const { vault, token } = await loadFixture(deployVault);
        expect(await vault.decimals()).to.equal(await token.decimals());
      });
  
      it("Should receive symbol of ERC-20 token representing vault shares", async function () {
        const { vault } = await loadFixture(deployVault);
        expect(await vault.symbol()).to.equal("VLT");
      });
  
      it("Should receive name of ERC-20 token representing vault shares", async function () {
        const { vault } = await loadFixture(deployVault);
        expect(await vault.name()).to.equal("Vaultonomy");
      });

      it("Should display correct number of initial shares", async function () {
        const { vault } = await loadFixture(deployVault);
        expect(await vault.totalSupply()).to.equal(0);
      });

      it("Should display correct number of initial assets", async function () {
        const { vault } = await loadFixture(deployVault);
        const totalAssets = await vault.totalAssets()
        expect(totalAssets).to.equal(0);
      });
    });

    describe("Vault Operations", function() {
      let vault, token, underlyingAsset, owner, signer1, signer2, signer3;

      before("Deploy contract instance ", async function() {
        const result = await loadFixture(deployVault);
        vault = result.vault;
        token = result.token;
        underlyingAsset = result.underlyingAsset
        owner = result.owner;
        signer1 = result.signer1;
        signer2 = result.signer2;
        signer3 = result.signer3
      })

      it("Transfer underlying tokens to test accounts", async function () {
        const transferAmount = ethers.utils.parseEther("300");
        const transfer1 = await token.transfer(signer1.address, transferAmount);
        const transfer2 = await token.transfer(signer2.address, transferAmount);
        const transfer3 = await token.transfer(signer3.address, transferAmount);

        const ownerBalance = await token.balanceOf(owner.address);
        const signer1Balance = await token.balanceOf(signer1.address);
        const signer2Balance = await token.balanceOf(signer2.address);
        const signer3Balance = await token.balanceOf(signer3.address);

        // console.log("Owner BTN balance : ", ownerBalance.toString());
        console.log(`Account ${signer1.address} BTN balance : `, Number(signer1Balance) / 10**18);
        console.log(`Account ${signer2.address} BTN balance : `, Number(signer2Balance) / 10**18);
        console.log(`Account ${signer3.address} BTN balance : `, Number(signer3Balance) / 10**18);
      });

      it("Account 1 calling deposit() for 100 BTN", async function () {
        // Approve vault contract to transfer underlying token from signer
        const approveTransfer = await token.connect(signer1).approve(vault.address, ethers.utils.parseEther("100"));
        // console.log("Approval success : ", approveTransfer.hash)

        const depositTransaction = await vault.connect(signer1).deposit(ethers.utils.parseEther("100"), signer1.address)
        const signer1Balance = await token.balanceOf(signer1.address);
        const signer1Share = await vault.balanceOf(signer1.address)
        const vaultBalance = await vault.totalAssets()
        const sharesMinted = await vault.totalSupply();
        console.log(`Account ${signer1.address} BTN balance : `, Number(signer1Balance)/ 10**18);
        console.log(`Account ${signer1.address} Share balance : `, Number(signer1Share)/ 10**18);
        console.log("Vault asset balance : ", Number(vaultBalance) / 10**18)
        console.log("Total shares minted : ", Number(sharesMinted) / 10**18)
      });

      it("Account 2 calling mint() for 75 VLT", async function () {
        // Approve vault contract to transfer underlying token from signer
        const approveTransfer = await token.connect(signer2).approve(vault.address, ethers.utils.parseEther("75"));
        // console.log("Approval success : ", approveTransfer.hash)

        const depositTransaction = await vault.connect(signer2).deposit(ethers.utils.parseEther("75"), signer2.address)
        const signer2Balance = await token.balanceOf(signer2.address);
        const signer2Share = await vault.balanceOf(signer2.address)
        const vaultBalance = await vault.totalAssets()
        const sharesMinted = await vault.totalSupply();

        console.log(`Account ${signer2.address} BTN balance : `, Number(signer2Balance) / 10**18);
        console.log(`Account ${signer2.address} Share balance : `, Number(signer2Share) / 10**18);
        console.log("Vault asset balance : ", Number(vaultBalance) / 10**18)
        console.log("Total shares minted : ", Number(sharesMinted) / 10**18)
      });

      it("Account 1 calling withdraw() for 50 BTN", async function () {
        const withdrawTransaction = await vault.connect(signer1).withdraw(ethers.utils.parseEther("50"), signer1.address, signer1.address)
        const signer1Balance = await token.balanceOf(signer1.address);
        const signer1Share = await vault.balanceOf(signer1.address)
        const vaultBalance = await vault.totalAssets()
        const sharesMinted = await vault.totalSupply();

        console.log(`Account ${signer1.address} BTN balance : `, Number(signer1Balance)/ 10**18);
        console.log(`Account ${signer1.address} Share balance : `, Number(signer1Share)/ 10**18);
        console.log("Vault asset balance : ", Number(vaultBalance) / 10**18)
        console.log("Total shares minted : ", Number(sharesMinted) / 10**18)
      });

      it("Account 2 calling redeem() for 75 VLT", async function () {
        const withdrawTransaction = await vault.connect(signer2).redeem(ethers.utils.parseEther("75"), signer2.address, signer2.address)
        const signer2Balance = await token.balanceOf(signer2.address);
        const signer2Share = await vault.balanceOf(signer2.address)
        const vaultBalance = await vault.totalAssets()
        const sharesMinted = await vault.totalSupply();

        console.log(`Account ${signer2.address} BTN balance : `, Number(signer2Balance) / 10**18);
        console.log(`Account ${signer2.address} Share balance : `, Number(signer2Share) / 10**18);
        console.log("Vault asset balance : ", Number(vaultBalance) / 10**18)
        console.log("Total shares minted : ", Number(sharesMinted) / 10**18)
      });

    });
  });
  