import React, { useState, useEffect, Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import 'antd/dist/antd.css';
import { ethers } from "ethers";
import "./App.css";
import { Account } from "./components"

import IntroPage from './components/IntroPage.js';

import { usePoller } from "./hooks";

import Transactor from "./helpers/Transactor.js"; 

// Artifacts
import ACJSON from "./contracts/AnchorCertificates.json";

function App() {
  /* Universal State*/
  const [address, setAddress] = useState();
  const [injectedProvider, setInjectedProvider] = useState();
  const [minting, setMinting] = useState(false); // whether something is minting or not

  // chain ids (used as proxy for being connect to a provider)
  const [tokenId, setTokenId] = useState(0); // token Id to display
  const [injectedChainId, setInjectedChainId] = useState(null);
  const [hardcodedChainId, setHardcodedChainId] = useState(null); // set it manually

  let ACAddress = "0x600a4446094C341693C415E6743567b9bfc8a4A8"; // rinkeby
  // let ACAddress = "0x22A35Bc1CD2Edf8BD137812A4BB9DCcE77D82b34"; // rinkeby

  let dfPrice = "0.01"; // ~$20 @ 2000/ETH
  let dxPrice = "0.05"; // ~$100 @ 2000/ETH

  const [ACSigner, setACSigner] = useState(null);

  // NOTE: Currently not being used in Transactor, but keeping it in the code in case I want to turn it back on.
  // Currently, it's expected that the web3 provider sets it (eg, MetaMask fills it in).
  // const gasPrice = useGasPrice("fast"); 
  const gasPrice = 0;

  usePoller(()=>{pollInjectedProvider()},1999);

  async function pollInjectedProvider() {
      if(!injectedChainId) {
          if(injectedProvider && injectedProvider.network) {
              const id = await injectedProvider.network.chainId;
              setInjectedChainId(id);

              // comment out line for local or prod
              // setHardcodedChainId(1); // mainnet
              // setHardcodedChainId(4); // rinkeby
              setHardcodedChainId(id); // local (uses injectedProvider)
              
          }
      }
  } 
  
  // load signers if there's an injected provider
  useEffect(() => {
    async function loadSigners() {
      if(injectedChainId !== null) {
        const signer = await injectedProvider.getSigner();
        const ACSigner = new ethers.Contract(ACAddress, ACJSON.abi, signer);
        setACSigner(ACSigner);
      }
    }
    loadSigners();
  }, [injectedChainId]);


  async function mintAnchorCertificate(type) {
    let val;
    if(type === "default") { val = ethers.utils.parseEther(dfPrice); }
    if(type === "deluxe") { val = ethers.utils.parseEther(dxPrice); }
    const tx = Transactor(injectedProvider, gasPrice);
    setMinting(true);
    tx(ACSigner.functions.mintCertificate({value: val}), async function (update) {
      /*Used for testing UI*/
      // await new Promise(resolve => setTimeout(resolve, 5000));
      console.log(update);
      if(update.eventCode === "txConfirmed") {
        const txResponse = await injectedProvider.getTransaction(update.hash);
        console.log(txResponse);
        const receipt = await txResponse.wait();
        console.log(receipt);
        const tokenId = receipt.logs[0].topics[3];
        setTokenId(tokenId);
        setMinting(false);
      }

      /* if user denies tx */
      if(update.code !== undefined) {
        if(update.code === 4001) {
          setMinting(false);
        }
      }
    });
  }
  
  return (
      <div>
      <Account
        address={address}
        setAddress={setAddress}
        injectedProvider={injectedProvider}
        setInjectedProvider={setInjectedProvider}
      />
      <Switch>
      <Route exact path="/">
          <IntroPage
            address={address}
            ACSigner={ACSigner}
            injectedChainId={injectedChainId}
            hardcodedChainId={hardcodedChainId}
            mintAnchorCertificate={mintAnchorCertificate}
            tokenId={tokenId}
            minting={minting}
            dfPrice={dfPrice}
            dxPrice={dxPrice}
          />
      </Route>
      </Switch>
      </div>
  );
}

class AppRoutes extends Component {
  render() {
    return (
      <Router>
        <Switch>        
          <Route path='/:page'>
            <App />
          </Route>
          <Route exact path='/'>
            <App />
          </Route>
        </Switch>
      </Router>
    )
  }
}

export default AppRoutes;
