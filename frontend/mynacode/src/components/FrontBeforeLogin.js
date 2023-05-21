import React from 'react';
import { Button, Divider } from 'antd';
import IP, {IP_image} from "../components/ipConfig";
import protocol from "../components/httpORhttps";

const FrontBeforeLogin = (props) => {

  return(
    <div style={{ height:'100%', display: 'flex', flexDirection: 'column', backgroundColor:'#383838'}}>

      {/* ***FRONTPAGE CATCHPHRASE*** */}
      <div style={{margin: '140px 20px 100px 75px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{textAlign: 'center', marginBottom:'30px', fontFamily: 'Helvetica, Arial, sans-serif', fontSize: '40px', color:'#87CEFA'}}>
         Keep your Machine Learning projects organized using simple blocks.
      </div>

      <div style={{marginBottom:'40px', fontFamily: 'Helvetica, Arial, sans-serif', fontSize: '25px', color:'#87CEFA'}}>
         <code style={{backgroundColor:'black', color: 'yellow', padding:10}}>pip install mynacode</code>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
         <div>
          <img height={400} src={protocol+"://"+IP_image+"/media/mynacode_front.jpg"} alt="Italian Trulli" />
         </div>
      </div>
      </div>

    </div>
  );
  
};

export default FrontBeforeLogin;