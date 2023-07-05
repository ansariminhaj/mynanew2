import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import IP, {IP_image} from "../components/ipConfig";
import { Link } from 'react-router-dom';
import { Layout, Menu, Divider} from 'antd';
import CreateGraph from "../components/CreateGraph";
import { LeftCircleOutlined } from '@ant-design/icons';
import protocol from "../components/httpORhttps";


const { Content, Sider } = Layout;

const Docs = (props) => {
  const [menuItem, setMenuItem] = useState(0);

  function getItem(label, key, children, type) {
    return {
      key,
      children,
      label,
      type,
    };
  }

  let items_list=[getItem(<div id={0} style={{ display:'flex', justifyContent:'center', alignItems:'center', fontWeight:'bold', color:'#38b6ff', fontSize:'17px'}}>Quick Setup</div>)]

  function selectDoc(e){
    setMenuItem(e.domEvent.target.id)
  }

  return (
    <Layout>
      <Sider>
        <Layout style={{backgroundColor:'#383838'}}>

            <Menu
              mode="inline"
              onClick={selectDoc}
              style={{
                width: 225,
                fontFamily: 'Helvetica, Arial, sans-serif', 
                fontSize: '15px',
                minHeight: '100vh',
                border:'4px solid #38b6ff',
                fontWeight: 'bold',
                position: 'fixed'
              }}
              items={items_list}
            />

        </Layout>
      </Sider>
      <Content style={{padding: '25px 35vh 10px 100px', minHeight: '100vh', fontFamily: 'Helvetica, Arial, sans-serif', display: 'flex', flexDirection:'column', overflowY: 'auto'}}>
        <Layout className="site-layout">

              {menuItem == 0 ?
              <div>
              <p style={{fontFamily: 'Helvetica, Arial, sans-serif', fontWeight:'bold', fontSize:'30px', color: '#18191a'}}> Quick Setup </p>
                
                <div style={{fontFamily: 'Helvetica, Arial, sans-serif', fontSize:'17px', color: '#18191a'}}>
                  <p> 
                  Setting up Mynacode takes less than a minute! Follow the steps below.
                  </p>

                  <ol type="a">
                  <li style={{marginBottom:'15px'}}>
                  Create an account <a href={"/signup"} style={{color:'#38b6ff', fontWeight:'bold'}}> Sign Up! </a>
                  </li>

                  <li style={{marginBottom:'15px'}}>
                  Create a new Project. Within that project, create a new run. You can create multiple runs per project. Copy the Run ID found at the top of each run.
                  </li>

                  <li style={{marginBottom:'15px'}}>
                  Install Mynacode
                  

                  <ul >
                  <li><code style={{color:'purple', fontWeight:'bold'}}>pip install mynacode</code></li>
                  </ul>

                  </li>

                  <li style={{marginBottom:'15px'}}>Paste the following at the start of your code. Your 
                  Username and Key can be accessed from your account. 
                  

                  <ul style={{marginBottom:'15px'}}>
                  <li><code style={{color:'purple', fontWeight:'bold'}}>mynacode.login('Your Username', 'Your Key')</code></li>
                  </ul>

                  </li>

                  <li>To log system information (GPU, CPU, Memory, Installed Python Libraries etc).</li>
                  <ul>
                  <li style={{marginBottom:'15px'}}><code style={{color:'purple', fontWeight:'bold'}}>mynacode.metadata(run_id)</code></li>
                  </ul>

                  <li>To log csv file information (Null Values, Unique Values, Column Names etc). Note, this does not save the actual data.</li>
                  <ul>
                  <li style={{marginBottom:'15px'}}><code style={{color:'purple', fontWeight:'bold'}}>mynacode.csv(run_id, dataframe, node_name)</code></li>
                  </ul>


                  <li>To log variables.</li>
                  <ul>
                  <li style={{marginBottom:'15px'}}><code style={{color:'purple', fontWeight:'bold'}}>mynacode.variables(run_id, variables_dict = {'{'}{'}'}, node_name)</code></li>
                  </ul>

                  <li>To log dataset information. </li>
                  <ul>
                  <li style={{marginBottom:'15px'}}><code style={{color:'purple', fontWeight:'bold'}}>mynacode.datasets(run_id, dataset_dict = {'{'}{'}'}, node_name)</code></li>
                  </ul>

                  <li>To log results (Senstivity, Specificity, AUC etc).</li>
                  <ul>
                  <li><code style={{color:'purple', fontWeight:'bold'}}>mynacode.results(run_id, y_true = [], y_predicted = [], results_dict = {'{'}{'}'}, node_name="Results", problem_type = 'binary classification', hist_bins=20)</code></li>
                  </ul>

                  </ol>
                </div>

              </div>
              :
              null}

        </Layout>
      </Content>

    </Layout>



  );
  
};

export default Docs;