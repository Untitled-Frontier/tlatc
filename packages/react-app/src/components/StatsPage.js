import React, { Fragment, useState, useEffect} from "react";
import { useParams, Link } from "react-router-dom";
import { gql, useLazyQuery } from '@apollo/client';

import { ethers } from 'ethers';
import { Button } from "antd";
import moment from "moment";
/*
One piece + actions on one page
*/

function StatsPage(props) {
    // let { id } = useParams();

    const STATS_QUERY = gql`
    {
      certificates(first: 1000) {
        id
        type
      }
    }
    `

    const palettes = [
      ["#eca3f5", "#fdbaf9", "#b0efeb", "#edffa9"],
      ["#75cfb8", "#bbdfc8", "#f0e5d8", "#ffc478"],
      ["#ffab73", "#ffd384", "#fff9b0", "#ffaec0"],
      ["#94b4a4", "#d2f5e3", "#e5c5b5", "#f4d9c6"],
      ["#f4f9f9", "#ccf2f4", "#a4ebf3", "#aaaaaa"],
      ["#caf7e3", "#edffec", "#f6dfeb", "#e4bad4"],
      ["#f4f9f9", "#f1d1d0", "#fbaccc", "#f875aa"],
      ["#fdffbc", "#ffeebb", "#ffdcb8", "#ffc1b6"],
      ["#f0e4d7", "#f5c0c0", "#ff7171", "#9fd8df"],
      ["#e4fbff", "#b8b5ff", "#7868e6", "#edeef7"],
      ["#ffcb91", "#ffefa1", "#94ebcd", "#6ddccf"],
      ["#bedcfa", "#98acf8", "#b088f9", "#da9ff9"],
      ["#bce6eb", "#fdcfdf", "#fbbedf", "#fca3cc"],
      ["#ff75a0", "#fce38a", "#eaffd0", "#95e1d3"],
      ["#fbe0c4", "#8ab6d6", "#2978b5", "#0061a8"],
      ["#dddddd", "#f9f3f3", "#f7d9d9", "#f25287"]
    ];

    const reasons = [
      "BUILD",
      "TRAIN",
      "SEE",
      "DREAM",
      "LIVE",
      "DANCE",
      "HOPE",
      "ARCHITECT",
      "EXPLORE",
      "EAT",
      "TASTE",
      "SMELL",
      "RUN",
      "BE",
      "MEANDER",
      "WALK",
      "LEAVE",
      "LOVE",
      "REMINISCE",
      "GIVE",
      "ASCEND",
      "MEET",
      "LEARN",
      "ENCOMPASS",
      "MEDITATE",
      "FIND",
      "SEEK",
      "LAUGH",
      "LISTEN",
      "FEEL",
      "TOUCH",
      "FORGIVE",
      "ATONE",
      "ACCEPT",
      "PLAY",
      "SING",
      "DRIVE",
      "CLIMB",
      "PAINT",
      "CODE",
      "PONDER",
      "SLEEP",
      "FLY",
      "CREATE",
      "WRITE",
      "DIRECT",
      "ESCAPE", 
      "FALL",
      "FLOURISH",
      "JAM",
      "IMPROVISE",
      "JUMP",
      "TREAT",
      "GIFT",
      "EXIT",
      "MIX",
      "SAIL",
      "MAKE",
      "SOLVE",
      "SEARCH",
      "THINK",
      "RESEARCH",
      "ADVANCE",
      "REASON"
    ]

    const [detailsSection, setDetailsSection] = useState("");

    const [savedData, setSavedData] = useState(null);

    const [ getStats, { loading, error, data }] = useLazyQuery(STATS_QUERY, { fetchPolicy: 'network-only'});

    useEffect(() => {
      getStats();
    }, []);

    useEffect(() => {
      if(!!data) {
        if(savedData !== null) {
            setSavedData(data);
        } else { setSavedData(data); }
      }

    }, [data]);

    function getAttributesFromHash(hash) {
      //
      // const tid = "1843077322694485927198323366101614973862212520735689173551697070803419013199";
      const hex = ethers.BigNumber.from(hash).toHexString().slice(2);

      let bytes = [];
      for (let c = 0; c < hex.length; c += 2) {
        bytes.push(parseInt(hex.substr(c, 2), 16));
      }

      const p = parseInt(bytes[0]/16);
      const r = parseInt(bytes[1]/4);

      // console.log('id, hash, pid, rid,', hash, hex, p.toString(), r.toString());

      return { paletteId: p.toString(), reasonId: r.toString()}
    }

    function initCounter() {
      let counter = {'palettes': {}, 'reasons': {}, 'count': 0};
      for(let i = 0; i<64; i+=1) {
        if(i < 16) {counter.palettes[i] = 0;}
        counter.reasons[i] = 0;
      }

      return counter;
    }

    function parseCertificates(certs) {
      let dfCounter = initCounter();
      let dxCounter = initCounter();

      for (const cert of certs) {
        const attr = getAttributesFromHash(cert.id);
        if(cert.type === "Default") {
          dfCounter['count'] += 1;
          dfCounter['palettes'][attr.paletteId] += 1;
          dfCounter['reasons'][attr.reasonId] += 1;
        } else if(cert.type === "Deluxe") {
          dxCounter['count'] += 1;
          dxCounter['palettes'][attr.paletteId] += 1;
          dxCounter['reasons'][attr.reasonId] += 1;
        }
      }

      const counter = {"default": dfCounter, "deluxe": dxCounter};
      return counter;
    }

    function createAttributeHTML(counter) {
      let paletteHTML = [];
      for(const [paletteId, paletteCount] of Object.entries(counter.palettes).sort(([,a],[,b]) => a-b)) {
        const paletteArr = palettes[paletteId];
        const paletteStr = paletteArr.map((val) => {
          return <span style={{backgroundColor:val}}>{val}</span>;
        });
        paletteHTML.push(<>{paletteStr} - {paletteCount}<br /></>);
      }

      let reasonsHTML = [];
      for(const [reasonId, reasonCount] of Object.entries(counter.reasons).sort(([,a],[,b]) => a-b)) {
        reasonsHTML.push(<>TO {reasons[reasonId]} - {reasonCount}<br /></>);
      }

      return {paletteHTML, reasonsHTML};
    }

    // todo: is this totally necessary? is this merely vestigial when it was necessary to refire?
    useEffect(() => {

      if(savedData !== null) {      
        // set details
        let detailsHTML;
        const counter = parseCertificates(savedData.certificates);

        const dfHTML = createAttributeHTML(counter.default);
        const dxHTML = createAttributeHTML(counter.deluxe);


        detailsHTML = <div style={{float:'left',textAlign:'left'}}>
          <h2>Anchor Certificate Collection Stats: </h2>
          <h3>Deluxe Certificates: {counter.deluxe.count}</h3>
          Palettes: <br />
          {dxHTML.paletteHTML} <br />
          Reasons: <br />
          {dxHTML.reasonsHTML} <br />
          <h3>Default Certificates: {counter.default.count} </h3>
          Palettes: <br />
          {dfHTML.paletteHTML} <br />
          Reasons: <br />
          {dfHTML.reasonsHTML}
          <br />
        </div>;
      
        setDetailsSection(detailsHTML);
      }
    }, [savedData]); 

    return (
        <div className="App" style={{textAlign:'center'}}> 
          {detailsSection}
        </div>
    );
}

export default StatsPage
