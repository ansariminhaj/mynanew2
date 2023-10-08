import React from 'react';
import { Button, Divider } from 'antd';
import IP, {IP_image} from "../components/ipConfig";
import protocol from "../components/httpORhttps";
import {BarChartOutlined, FileDoneOutlined, TeamOutlined, SaveOutlined} from '@ant-design/icons';


const FrontBeforeLogin = (props) => {

  return(
    <div style={{ height:'100%', display: 'flex', flexDirection: 'column', backgroundColor:'#383838'}}>

      {/* ***FRONTPAGE CATCHPHRASE*** */}
      <div style={{margin: '140px 20px 100px 75px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{textAlign: 'center', marginBottom:'30px', fontFamily: 'Helvetica, Arial, sans-serif', fontSize: '40px', color:'#87CEFA'}}>
         Keep your Machine Learning projects organized and easily reproducible.
      </div>

      <div style={{marginBottom:'90px', fontFamily: 'Helvetica, Arial, sans-serif', fontSize: '25px', color:'#87CEFA'}}>
         <code style={{backgroundColor:'black', color: 'yellow', padding:10}}>pip install mynacode</code>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row'}}>
         <div>
           <div style={{paddingLeft:'30px', color:'#87CEFA', fontSize:'20px', fontFamily:'Helvetica, Arial, sans-serif'}}> Track and save best Models </div>
           < BarChartOutlined style={{padding:'20px', fontSize: '200px', color:'orange'}} />       
         </div>
         <div>
            <div style={{paddingLeft:'30px', color:'#87CEFA', fontSize:'20px', fontFamily:'Helvetica, Arial, sans-serif'}}> Save all datasets </div>
            <SaveOutlined style={{padding:'20px', fontSize: '200px', color:'#DA70D6'}} />   
         </div>
         <div>
           <div style={{paddingLeft:'30px', color:'#87CEFA', fontSize:'20px', fontFamily:'Helvetica, Arial, sans-serif'}}> Save all Python files </div>
           < FileDoneOutlined style={{padding:'20px', fontSize: '200px', color:'#66FF99'}} />     
         </div>
         <div>
            <div style={{paddingLeft:'30px', color:'#87CEFA', fontSize:'20px', fontFamily:'Helvetica, Arial, sans-serif'}}> Share projects with peers </div>
            <TeamOutlined style={{padding:'20px', fontSize: '200px', color:'#f1807e'}} />
         </div>
      </div>

      <div style={{paddingTop:'50px'}}>
        <iframe width="712" height="400" src="https://www.youtube.com/embed/3LhXRC7KSFE?si=ikE3BhVb0YF4-jpy" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
      </div>
      </div>

    </div>
  );
  
};

export default FrontBeforeLogin;