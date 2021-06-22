const { time, balance } = require('@openzeppelin/test-helpers');

const delay = duration => new Promise(resolve => setTimeout(resolve, duration));
const { expect } = require("chai");  

const { loadFixture } = require('ethereum-waffle');
const dataUriToBuffer = require('data-uri-to-buffer');
const { ethers } = require('hardhat');
const ether = require('@openzeppelin/test-helpers/src/ether');

let AC; //AnchorCertificates

let dfPrice = "0.01"; // ~$20
let dxPrice = "0.05"; // ~$100

describe("AnchorCertificates", function() {
  let ac;
  let provider;
  let signers;
  let accounts;
  let snapshot;
  const gasLimit = 9500000; // if gas limit is set, it doesn't superfluosly run estimateGas, slowing tests down.

  this.beforeAll(async function() {
    provider = new ethers.providers.Web3Provider(web3.currentProvider);
    signers = await ethers.getSigners();
    accounts = await Promise.all(signers.map(async function(signer) {return await signer.getAddress(); }));
    AC = await ethers.getContractFactory("AnchorCertificates");
    ac = await AC.deploy("Anchor Certificates", "AC", accounts[2], '100', '1941431093'); // wide campaign window for tests. dates tested separately
    await ac.deployed();
    snapshot = await provider.send('evm_snapshot', []);
  });

 this.beforeEach(async function() {
    await provider.send('evm_revert', [snapshot]);
    snapshot = await provider.send('evm_snapshot', []);
  });

  it('AC: proper contract created', async () => {
    expect(await ac.name()).to.equal("Anchor Certificates");
    expect(await ac.symbol()).to.equal("AC");
  });

  it('AC: mint default certificate', async () => {
    const tx = await ac.connect(signers[1]).mintCertificate({value: ethers.utils.parseEther(dfPrice), gasLimit});
    const receipt = await tx.wait();
    const tokenId = receipt.events[0].args.tokenId.toString();

    expect(await ac.ownerOf(tokenId)).to.equal(accounts[1]);
    expect(await ac.defaultCertificatesSupply()).to.equal('1');
    expect(await ac.deluxeCertificatesSupply()).to.equal('0');

    const cert = await ac.certificates(tokenId);
    expect(cert.nr.toString()).to.equal("1");
    expect(cert.sponsored).to.equal('0x0000000000000000000000000000000000000000');

    const blob = await ac.tokenURI(tokenId);
    const decoded = dataUriToBuffer(blob);
    const j = JSON.parse(decoded.toString());

    expect(j.name).to.equal("Default Anchor Certificate #1");
    expect(j.description).to.equal("Anchor City Certificate");

    // todo: test some parts of the image?
  });

  it('AC: not enough funds to mint', async () => {
    await expect(ac.connect(signers[1]).mintCertificate({value: ethers.utils.parseEther('0.00001'), gasLimit})).to.be.revertedWith('MORE ETH NEEDED');
  });

  // test deluxe certificate
  it('AC: mint deluxe certificate', async () => {
    const tx = await ac.connect(signers[1]).mintCertificate({value: ethers.utils.parseEther(dxPrice), gasLimit});
    const receipt = await tx.wait();
    const tokenId = receipt.events[0].args.tokenId.toString();

    expect(await ac.ownerOf(tokenId)).to.equal(accounts[1]);
    expect(await ac.defaultCertificatesSupply()).to.equal('0');
    expect(await ac.deluxeCertificatesSupply()).to.equal('1');

    const cert = await ac.certificates(tokenId);
    expect(cert.nr.toString()).to.equal("1");
    expect(cert.sponsored).to.equal(accounts[1]);

    const blob = await ac.tokenURI(tokenId);
    const decoded = dataUriToBuffer(blob);
    const j = JSON.parse(decoded.toString());

    expect(j.name).to.equal("Deluxe Anchor Certificate #1");
    expect(j.description).to.equal("Anchor City Certificate");

  });

  it('AC: mint 10 default certificate', async () => {
    await ac.connect(signers[1]).mintCertificate({value: ethers.utils.parseEther(dfPrice), gasLimit});
    await ac.connect(signers[1]).mintCertificate({value: ethers.utils.parseEther(dfPrice), gasLimit});
    await ac.connect(signers[1]).mintCertificate({value: ethers.utils.parseEther(dfPrice), gasLimit});
    await ac.connect(signers[1]).mintCertificate({value: ethers.utils.parseEther(dfPrice), gasLimit});
    await ac.connect(signers[1]).mintCertificate({value: ethers.utils.parseEther(dfPrice), gasLimit});
    await ac.connect(signers[1]).mintCertificate({value: ethers.utils.parseEther(dfPrice), gasLimit});
    await ac.connect(signers[1]).mintCertificate({value: ethers.utils.parseEther(dfPrice), gasLimit});
    await ac.connect(signers[1]).mintCertificate({value: ethers.utils.parseEther(dfPrice), gasLimit});
    await ac.connect(signers[1]).mintCertificate({value: ethers.utils.parseEther(dfPrice), gasLimit});
    const tx = await ac.connect(signers[1]).mintCertificate({value: ethers.utils.parseEther(dfPrice), gasLimit});
    const receipt = await tx.wait();
    const tokenId = receipt.events[0].args.tokenId.toString();

    expect(await ac.ownerOf(tokenId)).to.equal(accounts[1]);
    expect(await ac.defaultCertificatesSupply()).to.equal('10');
    expect(await ac.deluxeCertificatesSupply()).to.equal('0');

    const cert = await ac.certificates(tokenId);
    expect(cert.nr.toString()).to.equal("10");
    expect(cert.sponsored).to.equal('0x0000000000000000000000000000000000000000');

    const blob = await ac.tokenURI(tokenId);
    const decoded = dataUriToBuffer(blob);
    const j = JSON.parse(decoded.toString());

    expect(j.name).to.equal("Default Anchor Certificate #10");
    expect(j.description).to.equal("Anchor City Certificate");
  });

  // mint 10 default certificates
  // mint 10 deluxe certificates
  it('AC: mint 10 deluxe certificate', async () => {
    await ac.connect(signers[1]).mintCertificate({value: ethers.utils.parseEther(dxPrice), gasLimit});
    await ac.connect(signers[1]).mintCertificate({value: ethers.utils.parseEther(dxPrice), gasLimit});
    await ac.connect(signers[1]).mintCertificate({value: ethers.utils.parseEther(dxPrice), gasLimit});
    await ac.connect(signers[1]).mintCertificate({value: ethers.utils.parseEther(dxPrice), gasLimit});
    await ac.connect(signers[1]).mintCertificate({value: ethers.utils.parseEther(dxPrice), gasLimit});
    await ac.connect(signers[1]).mintCertificate({value: ethers.utils.parseEther(dxPrice), gasLimit});
    await ac.connect(signers[1]).mintCertificate({value: ethers.utils.parseEther(dxPrice), gasLimit});
    await ac.connect(signers[1]).mintCertificate({value: ethers.utils.parseEther(dxPrice), gasLimit});
    await ac.connect(signers[1]).mintCertificate({value: ethers.utils.parseEther(dxPrice), gasLimit});
    const tx = await ac.connect(signers[1]).mintCertificate({value: ethers.utils.parseEther(dxPrice), gasLimit});
    const receipt = await tx.wait();
    const tokenId = receipt.events[0].args.tokenId.toString();

    expect(await ac.ownerOf(tokenId)).to.equal(accounts[1]);
    expect(await ac.defaultCertificatesSupply()).to.equal('0');
    expect(await ac.deluxeCertificatesSupply()).to.equal('10');

    const cert = await ac.certificates(tokenId);
    expect(cert.nr.toString()).to.equal("10");
    expect(cert.sponsored).to.equal(accounts[1]);

    const blob = await ac.tokenURI(tokenId);
    const decoded = dataUriToBuffer(blob);
    const j = JSON.parse(decoded.toString());

    expect(j.name).to.equal("Deluxe Anchor Certificate #10");
    expect(j.description).to.equal("Anchor City Certificate");
  });

  it('AC: mint 5/5 def/dex certificates', async () => {
    await ac.connect(signers[1]).mintCertificate({value: ethers.utils.parseEther(dxPrice), gasLimit});
    await ac.connect(signers[2]).mintCertificate({value: ethers.utils.parseEther(dxPrice), gasLimit});
    await ac.connect(signers[3]).mintCertificate({value: ethers.utils.parseEther(dxPrice), gasLimit});
    await ac.connect(signers[4]).mintCertificate({value: ethers.utils.parseEther(dxPrice), gasLimit});
    const dxTx = await ac.connect(signers[5]).mintCertificate({value: ethers.utils.parseEther(dxPrice), gasLimit});
    await ac.connect(signers[1]).mintCertificate({value: ethers.utils.parseEther(dfPrice), gasLimit});
    await ac.connect(signers[2]).mintCertificate({value: ethers.utils.parseEther(dfPrice), gasLimit});
    await ac.connect(signers[3]).mintCertificate({value: ethers.utils.parseEther(dfPrice), gasLimit});
    await ac.connect(signers[4]).mintCertificate({value: ethers.utils.parseEther(dfPrice), gasLimit});
    const tx = await ac.connect(signers[5]).mintCertificate({value: ethers.utils.parseEther(dfPrice), gasLimit});
    const receipt = await tx.wait();
    const tokenId = receipt.events[0].args.tokenId.toString();

    const dxReceipt = await dxTx.wait();
    const dxTokenId = dxReceipt.events[0].args.tokenId.toString(); 

    expect(await ac.ownerOf(tokenId)).to.equal(accounts[5]);
    expect(await ac.ownerOf(dxTokenId)).to.equal(accounts[5]);

    expect(await ac.defaultCertificatesSupply()).to.equal('5');
    expect(await ac.deluxeCertificatesSupply()).to.equal('5');

    const cert = await ac.certificates(tokenId);
    expect(cert.nr.toString()).to.equal("5");
    expect(cert.sponsored).to.equal('0x0000000000000000000000000000000000000000');

    const dxCert = await ac.certificates(dxTokenId);
    expect(dxCert.nr.toString()).to.equal("5");
    expect(dxCert.sponsored).to.equal(accounts[5]);

    const blob = await ac.tokenURI(tokenId);
    const decoded = dataUriToBuffer(blob);
    const j = JSON.parse(decoded.toString());

    expect(j.name).to.equal("Default Anchor Certificate #5");
    expect(j.description).to.equal("Anchor City Certificate");

    const dxBlob = await ac.tokenURI(dxTokenId);
    const dxDecoded = dataUriToBuffer(dxBlob);
    const dxJ = JSON.parse(dxDecoded.toString());

    expect(dxJ.name).to.equal("Deluxe Anchor Certificate #5");
    expect(dxJ.description).to.equal("Anchor City Certificate");
  });

  // test transfer of deluxe certificate. sponsored should stay same same
  it('AC: transfer of deluxe certificate', async () => {
    const tx = await ac.connect(signers[1]).mintCertificate({value: ethers.utils.parseEther(dxPrice), gasLimit});
    const receipt = await tx.wait();
    const tokenId = receipt.events[0].args.tokenId.toString();

    await ac.connect(signers[1]).transferFrom(accounts[1], accounts[2], tokenId);

    expect(await ac.ownerOf(tokenId)).to.equal(accounts[2]);
    expect(await ac.defaultCertificatesSupply()).to.equal('0');
    expect(await ac.deluxeCertificatesSupply()).to.equal('1');

    const cert = await ac.certificates(tokenId);
    expect(cert.nr.toString()).to.equal("1");
    expect(cert.sponsored).to.equal(accounts[1]); 

    const blob = await ac.tokenURI(tokenId);
    const decoded = dataUriToBuffer(blob);
    const j = JSON.parse(decoded.toString());

    expect(j.name).to.equal("Deluxe Anchor Certificate #1");
    expect(j.description).to.equal("Anchor City Certificate");
  });

  it('AC: test withdraw of funds', async () => {
    await ac.connect(signers[1]).mintCertificate({value: ethers.utils.parseEther(dxPrice), gasLimit});
    await expect(ac.connect(signers[1]).withdrawETH()).to.be.revertedWith("NOT_COLLECTOR");
    const tx = await ac.connect(signers[2]).withdrawETH();
    await expect(tx).to.changeEtherBalance(signers[2], ethers.utils.parseEther(dxPrice));
  });

  it("AC: hit deluxe cap", async () => {
    for(let i = 0; i < 100; i+=1) {
      await ac.connect(signers[1]).mintCertificate({value: ethers.utils.parseEther(dxPrice), gasLimit});
    }

    await expect(ac.connect(signers[1]).mintCertificate({value: ethers.utils.parseEther(dxPrice), gasLimit})).to.be.revertedWith("MAX_DX_REACHED");
    await ac.connect(signers[1]).mintCertificate({value: ethers.utils.parseEther(dfPrice), gasLimit});
    expect(await ac.defaultCertificatesSupply()).to.equal('1');
    expect(await ac.deluxeCertificatesSupply()).to.equal('100');
  });

  it("AC: test that all permutations are being hit correctly", async () => {
    const T = await ethers.getContractFactory("uint8Tester");
    const t = await T.deploy(); // wide campaign window for tests. dates tested separately
    await t.deployed();

    const tx = await ac.connect(signers[1]).mintCertificate({value: ethers.utils.parseEther(dxPrice), gasLimit});
    const receipt = await tx.wait();
    const tokenId = receipt.events[0].args.tokenId.toString();
  
    // only divides by 4 and 16 are done
    for (let i = 0; i < 255; i+=1) {
      const h = ethers.utils.hexlify(i);
      const nr4 = await t.divide(h,4);
      const nr16 = await t.divide(h,16);
      if(i % 4 == 0) { expect(nr4).to.equal(i/4) }
      if(i % 16 == 0) { expect(nr16).to.equal(i/16) }
    }

  });

  it("AC: test start date + end date", async () => {
    const ac2 = await AC.deploy("Anchor Certificates", "AC", accounts[2], '2541431093', '3541431094'); // wide campaign window for tests. dates tested separately
    await ac2.deployed();

    await expect(ac2.connect(signers[1]).mintCertificate({value: ethers.utils.parseEther(dfPrice), gasLimit})).to.be.revertedWith("NOT_STARTED");
    await time.increaseTo("3541431095"); // 1 sec after end campaign
    await expect(ac2.connect(signers[1]).mintCertificate({value: ethers.utils.parseEther(dfPrice), gasLimit})).to.be.revertedWith("ENDED");
  });

});