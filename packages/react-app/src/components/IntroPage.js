import React, { useState, useEffect, Fragment } from "react";
import { Button } from "antd";

import acImg from "./ac.png";
import CellsComponent from "./CellsComponent";

function IntroPage(props) {

    const [mintSection, setMintSection] = useState('');
    const [displaySection, setDisplaySection] = useState('');

    const wrongNetworkHTML = <Fragment>You are on the wrong network. Please switch to mainnet on your web3 wallet and refresh the page.</Fragment>;

    const offlineHTML = <Fragment>
    [In order to mint a certificate, you need to  have a web3/Ethereum-enabled browser and connect it (see top right of the page). Please download
      the <a href="https://metamask.io">MetaMask Chrome extension</a> or open in an Ethereum-compatible browser.]
    </Fragment>;

    function mintDefaultAnchorCertificate() {
      props.mintAnchorCertificate('default');
    }

    function mintDeluxeAnchorCertificate() {
      props.mintAnchorCertificate('deluxe');
    }

    useEffect(() => {
        if(typeof props.address !== 'undefined' && props.ACSigner !== null) {
            const newMintHTML = <Fragment>
                {props.dfPrice} ETH (~$20)<br />
                <Button size={"small"} loading={props.minting} onClick={mintDefaultAnchorCertificate}>
                   Mint Default Certificate.
                </Button>
                <br />
                <br />
                {props.dxPrice} ETH (~$100)<br />
                <Button size={"small"} loading={props.minting} onClick={mintDeluxeAnchorCertificate}>
                   Mint Deluxe Certificate.
                </Button>
            </Fragment>
            setMintSection(newMintHTML);
        }
    }, [props.address, props.ACSigner, props.minting]);

    useEffect(() => {
        if(props.injectedChainId !== props.hardcodedChainId && props.injectedChainId !== null) {
          setMintSection(wrongNetworkHTML);
        } else if(props.injectedChainId == null) {
          setMintSection(offlineHTML);
        }
      }, [props.hardcodedChainId, props.ACSigner]); // TODO: re-add signer coming in

    useEffect(() => {
      if(props.tokenId !== 0) {
        // new certificate was minted, thus display it.
        setDisplaySection(
          <Fragment>
            <h2>Your Newly Minted Certificate!</h2>
            <h2>Welcome To Anchor City!</h2>
            <CellsComponent hash={props.tokenId} ACSigner={props.ACSigner} />
          </Fragment>
        );
      }
    }, [props.tokenId, props.ACSigner]);

    return (

        <div className="App" style={{textAlign:"justify"}}> 
        <img src={acImg} alt="Anchor Certificates" style={{display:"block", marginLeft:"auto", marginRight: "auto", maxWidth:"100%"}}/> <br />
        In the story, <a href="https://www.untitledfrontier.studio/blog/the-logged-universe-1-the-line-to-anchor-city"> "The Line To Anchor City"</a>,
        Alan Bloom and many other uploaded minds attempt to join reality again by moving to Anchor City. 
        <br />
        <br />
        Join him and others by purchasing NFT memorabilia from the story in form of generative art anchor certificates.
        Until Monday 26 July 2021 (14:00 GMT), fans can mint any amount of default certificates for ~$20 (0.01 ETH) or pay to mint a 
        deluxe certificate for ~$100 (0.05 ETH) until supply (100) lasts. After the campaign ends, no new certificates for this edition can be minted.<br />
        <br />
        <h2>Default Certificates</h2>
        Each default certificate is comprised of the following randomly generated features: <br />
        <ul>
          <li>One of 16 colour palettes.</li>
          <li>One of 64 reasons to move back to Anchor City. (eg, to build, to dance, to fly, to sing).</li>
          <li>Variable heights of the skyscraper barcode and changes in the spacing/patterns.</li>
        </ul>
        There's no limit to the available amount of Default Certificates until the end of the campaign date.<br />
        <br />
        <h2>Deluxe Certificates</h2>
        Alongside the components of the default certificiates, each deluxe certificate contains: <br />
        <ul>
          <li>A different edition title: "DX1" vs "DF1". </li>
          <li>Only a maximum of 100 will exist. </li>
          <li>The buyer's address will forever be etched into the certificate as a sponsor (even when transferred elsewhere). </li>
        </ul>
        <br />
        {/* MINT SECTION */}
        <div className="section">
        <h2>Mint</h2>
        {mintSection}
        </div>
        <br />
        {displaySection}
        <br />
        <br />
        <div style={{textAlign:'center'}}>
        To view a certificate that you have minted in the past and the rest of the certificates, head on over to OpenSea below: <br />
        <br />
        <a href="https://opensea.io/collection/anchorcertificates" target="_blank"><Button>View The Entire Collection on OpenSea</Button></a>
        <br />
        <br />
        <br />
        </div>
        </div>
    );
}

export default IntroPage
