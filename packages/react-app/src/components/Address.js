import React from 'react'
import Blockies from 'react-blockies';
import { Typography, Skeleton } from 'antd';
const { Text } = Typography;

export default function Address(props) {

  if(!props.value){
    return (
      <span>
        <Skeleton avatar paragraph={{ rows: 1 }} />
      </span>
    )
  }

  let displayAddress = props.value.substr(0,6)

  let blockExplorer = "https://etherscan.io/address/"
  if(props.blockExplorer){
    blockExplorer = props.blockExplorer
  }

  if(props.minimized){
    return (
        <span style={{verticalAlign:"middle"}}>
          <a href={blockExplorer+props.value}>
            <Blockies seed={props.value.toLowerCase()} size={8} scale={2}/>
          </a>
        </span>
    );
  }

  let text
  if(props.onChange){
    text = (
      <Text editable={{onChange:props.onChange}} copyable={{text:props.value}}>
        <a href={blockExplorer+props.value}>{displayAddress}</a>
      </Text>
    )
  }else{
    text = (
      <Text copyable={{text:props.value}}>
        <a href={blockExplorer+props.value}>{displayAddress}</a>
      </Text>
    )
  }

  return (
    <span style={{paddingLeft:5,fontSize:18,marginTop:"10px"}}>
      {text}
    </span>
  );
}
