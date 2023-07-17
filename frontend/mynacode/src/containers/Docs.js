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
                  
                  <ul style={{color:'purple', fontWeight:'bold', marginTop:'6px'}}>
                  <li><code>pip install mynacode</code></li>
                  </ul>

                  </li>

                  <li style={{marginBottom:'15px'}}>Paste the following at the start of your code. Your 
                  Username and Key can be accessed from your account. 
                  
                  <ul style={{marginBottom:'15px', color:'purple', fontWeight:'bold'}}>
                  <li style={{marginTop:'6px'}}><code>mynacode.login('Your Username', 'Your Key')</code></li>
                  </ul>

                  </li>

                  <li style={{marginBottom:'6px'}}>To log system information (GPU, CPU, Memory, Installed Python Libraries etc).</li>
                  <ul>
                  <li style={{marginBottom:'15px', color:'purple', fontWeight:'bold'}}><code>mynacode.metadata(run_id)</code></li>
                  </ul>

                  <li style={{marginBottom:'6px'}}>To log csv file information (Null Values, Unique Values, Column Names etc). Note, this does not save the actual data.</li>
                  <ul>
                  <li style={{marginBottom:'15px', color:'purple', fontWeight:'bold'}}><code>mynacode.csv(run_id, dataframe, node_name)</code></li>
                  </ul>


                  <li style={{marginBottom:'6px'}}>To log variables.</li>
                  <ul>
                  <li style={{marginBottom:'15px', color:'purple', fontWeight:'bold'}}><code>mynacode.variables(run_id, variables_dict = {'{'}{'}'}, node_name)</code></li>
                  </ul>

                  <li style={{marginBottom:'6px'}}>To log dataset information. Note, this does not save the actual data. Only the label count, mean, min, and max of all three sets is saved. </li>
                  <ul>
                  <li style={{color:'purple', fontWeight:'bold', marginBottom:'10px'}}><code>mynacode.datasets(run_id, dataset_dict = {'{'}{'}'}, train_set = [], train_labels = [], test_set = [], test_labels = [], val_set = [], val_labels = [], problem_type = 'binary classification', node_name)</code></li>
                  <div style={{marginBottom:'10px'}}> Note that all sets and labels must be in either numpy array or list format. For PyTorch, if the dataset is in a dataloader object, please convert it to a list using this code: </div>

                  <div style={{color:'purple', marginBottom:'5px'}}><code>labels = [np.array(dataloader_object.dataset[i][1]) for i in range(len(dataloader_object.dataset))] </code></div>
                  <div style={{color:'purple', marginBottom:'15px'}}><code>data = [np.array(dataloader_object.dataset[i][0]) for i in range(len(dataloader_object.dataset))]</code></div>

                  
                  </ul>

                  <li style={{marginBottom:'6px'}}>To log results (Senstivity, Specificity, AUC etc).</li>
                  <ul>
                  <li><code style={{color:'purple', fontWeight:'bold'}}>mynacode.results(run_id, y_true = [], y_predicted = [], results_dict = {'{'}{'}'}, node_name="Results", problem_type = 'binary classification')</code></li>
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