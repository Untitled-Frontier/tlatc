import React, {useState} from "react";

function CellsComponent(props) {
    const hash = props.hash;
    let [svg, setSVG] = useState(null);

    if (props.ACSigner !== null) { 
        async function c() {
            const blob = await props.ACSigner.tokenURI(hash);
            const response = await fetch(blob); // parses base64 encoded blob to an HTML response
            const metadata = await response.json(); // parse HTML response to JSON form
            const imageResponse = await fetch(metadata.image);
            const s = await imageResponse.text();
            setSVG(s);
        }
        c();
    }


    return (
        <div style={{display:"flex", justifyContent:"center"}} 
            dangerouslySetInnerHTML={{ __html: svg}}    
        >
        </div>
    );
}

export default CellsComponent
