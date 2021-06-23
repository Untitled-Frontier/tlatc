
## Anchor Certificates

Certificate NFTs for the short story: The Line To Anchor City. All metadata + art is on-chain.

### Technicals

- This repo is forked from the excellent https://github.com/austintgriffith/scaffold-eth.
- hardhat + waffle smart contract development.
- ethers.js.
- Custom deploy function.
- Uses modified ERC721.
- Blocknative for monitoring transactions.
- web3modal for connecting to wallets.
  
### Development & Testing

Running Locally:

### 1. Start Node + Deploy Contracts 
```yarn install```  
```yarn run node```   
It will use the default mnemonic in ```./scripts/wallet-utils.js``` and start a local EVM.   
If you need a custom mnemonic, just:   
```export MNEMONIC="<insert_your_own_mnemonic_here>```   
```yarn run deploy_contracts_local```    
Save the curve address manually and copy-paste it to curveAddress in react-app/src/App.js.   
```yarn run publish_contracts```  
This copies the build files to the react-app.

### 2. Start Server
Back in this repo:   
```yarn run start```

### License

Code License:
MIT

