import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import IP, {IP_image} from "../components/ipConfig";
import { Link } from 'react-router-dom';
import { Layout, Menu, Divider, Tabs} from 'antd';
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



  <Tabs
    defaultActiveKey="1"
    items={[
      {
        label: 'Pytorch',
        key: '1',
        children:               <div>
              <p style={{fontFamily: 'Helvetica, Arial, sans-serif', fontWeight:'bold', fontSize:'30px', color: '#18191a'}}> Quick Setup </p>
                
                <div style={{fontFamily: 'Helvetica, Arial, sans-serif', fontSize:'17px', color: '#18191a'}}>
                  <p> 
                  Setting up Mynacode takes less than a minute! Follow the steps below.
                  </p>

                  <ol type="a">
                  <li style={{marginBottom:'30px'}}>
                  Create an account <a href={"/signup"} style={{color:'#38b6ff', fontWeight:'bold'}}> Sign Up! </a>
                  </li>

                  <li style={{marginBottom:'30px'}}>
                    Install Mynacode                 
                    <ul style={{color:'purple', fontWeight:'bold', marginTop:'5px'}}>
                      <li><code>pip install mynacode</code></li>
                    </ul>
                  </li>

                  <li style={{marginBottom:'30px'}}>
                    Create a new Project. 
                    <ul style={{color:'purple', fontWeight:'bold', marginTop:'5px'}}>
                      <li style={{marginBottom:'10px'}}><code>mynacode.start(base_folder='', project_name='')</code></li>
                    
                      <table style={{color:'#505050', 'borderSpacing': '25px 0px'}}>
                        <tr><td>base_folder:</td> <td>Base directory path of your project.</td></tr>
                        <tr><td>project_name:</td> <td>Name of the project.</td></tr>
                      </table>
                    </ul>
                  </li>

                  <li style={{marginBottom:'30px'}}>Paste the following at the start of your code. Your 
                    Username and Key can be accessed from your account.  
                    <ul style={{color:'purple', fontWeight:'bold', marginTop:'5px'}}>
                      <li style={{marginBottom:'10px'}}><code>mynacode.login(username, key)</code></li>

                      <table style={{color:'#505050', 'borderSpacing': '25px 0px'}}>
                        <tr><td>username:</td> <td>Account username.</td></tr>
                        <tr><td>key:</td> <td>Account key.</td></tr>
                      </table>

                    </ul>
                  </li>

                  {/*<li style={{marginBottom:'6px'}}>To log system information (GPU, CPU, Memory, Installed Python Libraries etc).</li>
                  <ul>
                  <li style={{marginBottom:'15px', color:'purple', fontWeight:'bold'}}><code>mynacode.metadata(run_id)</code></li>
                  </ul>*/}

                  <li style={{marginBottom:'30px'}}>
                    To log csv file information (Null Values, Unique Values, Column Names etc). Note, this does not save the actual data.
                    <ul style={{color:'purple', fontWeight:'bold', marginTop:'5px'}}>
                      <li style={{marginBottom:'10px'}}><code>mynacode.csv(run_id, dataframe, node_name)</code></li>
                    
                      <table style={{color:'#505050', 'borderSpacing': '25px 0px'}}>
                        <tr><td>username</td> <td>Account username.</td></tr>
                        <tr><td>key:</td> <td>Account key.</td></tr>
                      </table>

                    </ul>
                  </li>


                  {/*<li style={{marginBottom:'6px'}}>To log variables.</li>
                  <ul>
                  <li style={{marginBottom:'15px', color:'purple', fontWeight:'bold'}}><code>mynacode.variables(run_id, variables_dict = {'{'}{'}'}, node_name)</code></li>
                  </ul>*/}

                  <li style={{marginBottom:'30px'}}> 
                    To save project dataset on your local machine and log dataset path. 
                    <ul style={{color:'purple', fontWeight:'bold', marginTop:'5px'}}>
                      <li style={{color:'purple', fontWeight:'bold', marginBottom:'20px'}}><code>mynacode.torch_data(train_dataloader=None, val_dataloader=None, test_dataloader=None, dataset_name="", label_index=1,
         problem_type = 'binary classification',  node_name="Datasets", if_sweep_save_once = True, run_id = None)</code></li>
                    
                      <table style={{color:'#505050', 'borderSpacing': '25px 0px'}}>
                        <tr><td>train_dataloader:</td> <td>Pytorch train dataloader object.</td></tr>
                        <tr><td>val_dataloader:</td> <td>Pytorch val dataloader object.</td></tr>
                        <tr><td>test_dataloader:</td> <td>Pytorch test dataloader object.</td></tr>
                        <tr><td>dataset_name:</td> <td>Dataset name (This will be the name of the local directory where the datasets are stored).</td></tr>
                        <tr><td>label_index:</td> <td>Index of labels in the dataloader object.</td></tr>
                        <tr><td>problem_type:</td> <td>Problem type.</td></tr>
                        <tr><td>node_name:</td> <td>Where to store dataset path information.</td></tr>
                        <tr><td>if_sweep_save_once:</td> <td>In hyperparameter sweeps, datasets will only be saved once for optimization.</td></tr>
                        <tr><td>run_id:</td> <td>Run ID to log dataset paths. If None, the run ID generated automatically after calling the init function will be used.</td></tr>
                      </table>
                    </ul>
                  </li>

  
                

                  <li style={{marginBottom:'6px'}}>To log results (Senstivity, Specificity, AUC etc).</li>
                  <ul>
                  <li><code style={{color:'purple', fontWeight:'bold'}}>mynacode.results(run_id, y_true = [], y_predicted = [], results_dict = {'{'}{'}'}, node_name="Results", problem_type = 'binary classification')</code></li>
                  </ul>

                  </ol>
                </div>

              </div>,
      },
      {
        label: 'Keras',
        key: '2',
        children: <div>
              <p style={{fontFamily: 'Helvetica, Arial, sans-serif', fontWeight:'bold', fontSize:'30px', color: '#18191a'}}> Quick Setup </p>
                
                <div style={{fontFamily: 'Helvetica, Arial, sans-serif', fontSize:'17px', color: '#18191a'}}>
                  <p> 
                  Setting up Mynacode takes less than a minute! Follow the steps below.
                  </p>

                  <ol type="a">
                  <li style={{marginBottom:'30px'}}>
                  Create an account <a href={"/signup"} style={{color:'#38b6ff', fontWeight:'bold'}}> Sign Up! </a>
                  </li>

                  <li style={{marginBottom:'30px'}}>
                    Install Mynacode                 
                    <ul style={{color:'purple', fontWeight:'bold', marginTop:'5px'}}>
                      <li><code>pip install mynacode</code></li>
                    </ul>
                  </li>

                  <li style={{marginBottom:'30px'}}>
                    Create a new Project. 
                    <ul style={{color:'purple', fontWeight:'bold', marginTop:'5px'}}>
                      <li style={{marginBottom:'10px'}}><code>mynacode.start(base_folder='', project_name='')</code></li>
                      
                      <div style={{color:'#505050'}}>
                        <div>base_folder: Base directory path of your project.</div>
                        <div>project_name: Name of the project.</div>
                      </div>
                    </ul>
                  </li>

                  <li style={{marginBottom:'30px'}}>Paste the following at the start of your code. Your 
                    Username and Key can be accessed from your account.  
                    <ul style={{color:'purple', fontWeight:'bold', marginTop:'5px'}}>
                      <li style={{marginBottom:'10px'}}><code>mynacode.login(username, key)</code></li>

                      <div style={{color:'#505050'}}>
                        <div>username: Account username.</div>
                        <div>key: Account key.</div>
                      </div>
                    </ul>
                  </li>

                  {/*<li style={{marginBottom:'6px'}}>To log system information (GPU, CPU, Memory, Installed Python Libraries etc).</li>
                  <ul>
                  <li style={{marginBottom:'15px', color:'purple', fontWeight:'bold'}}><code>mynacode.metadata(run_id)</code></li>
                  </ul>*/}

                  <li style={{marginBottom:'6px'}}>To log csv file information (Null Values, Unique Values, Column Names etc). Note, this does not save the actual data.</li>
                  <ul>
                  <li style={{marginBottom:'15px', color:'purple', fontWeight:'bold'}}><code>mynacode.csv(run_id, dataframe, node_name)</code></li>
                  </ul>


                  {/*<li style={{marginBottom:'6px'}}>To log variables.</li>
                  <ul>
                  <li style={{marginBottom:'15px', color:'purple', fontWeight:'bold'}}><code>mynacode.variables(run_id, variables_dict = {'{'}{'}'}, node_name)</code></li>
                  </ul>*/}

                  <li style={{marginBottom:'6px'}}>To log dataset information or variables. Note, this does not save the actual data. Only the label count, mean, min, and max of the dataset is saved. </li>
                  <ul>
                  <li style={{color:'purple', fontWeight:'bold', marginBottom:'10px'}}><code>mynacode.data(run_id, dataset_dict = {'{'}{'}'}, train_set = [], train_labels = [], test_set = [], test_labels = [], val_set = [], val_labels = [], problem_type = 'binary classification', node_name)</code></li>
                  <div style={{marginBottom:'10px'}}> Note that all sets and labels must be converted to a numpy array or list. For PyTorch, if the dataset is in a dataloader object, please convert it to a list using this code: </div>

                  <div style={{color:'purple', marginBottom:'5px'}}><code>labels = [np.array(dataloader_object.dataset[i][1]) for i in range(len(dataloader_object.dataset))] </code></div>
                  <div style={{color:'purple', marginBottom:'15px'}}><code>data = [np.array(dataloader_object.dataset[i][0]) for i in range(len(dataloader_object.dataset))]</code></div>

                  
                  </ul>

                  <li style={{marginBottom:'6px'}}>To log results (Senstivity, Specificity, AUC etc).</li>
                  <ul>
                  <li><code style={{color:'purple', fontWeight:'bold'}}>mynacode.results(run_id, y_true = [], y_predicted = [], results_dict = {'{'}{'}'}, node_name="Results", problem_type = 'binary classification')</code></li>
                  </ul>

                  </ol>
                </div>

              </div>,
      },
    ]}
  />

        </Layout>
      </Content>

    </Layout>



  );
  
};

export default Docs;