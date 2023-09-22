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

                  <li style={{marginBottom:'30px'}}>
                    Create a new Project. 
                    <ul style={{color:'purple', fontWeight:'bold', marginTop:'5px'}}>
                      <li style={{marginBottom:'10px'}}><code>mynacode.start(base_folder='', project='')</code></li>
                    
                      <table style={{color:'#505050', 'borderSpacing': '25px 0px'}}>
                        <tr><td>base_folder:</td> <td>Base directory path of your project.</td></tr>
                        <tr><td>project:</td> <td>Name of the project.</td></tr>
                      </table>
                    </ul>
                  </li>


                  <li style={{marginBottom:'30px'}}>
                    Initialize a Run or a Sweep. 
                    <ul style={{color:'purple', fontWeight:'bold', marginTop:'5px'}}>
                      <li style={{marginBottom:'10px'}}><code>mynacode.init(sweep = False, sweep_name = "", run_name="", save_files = False)</code></li>
                    
                      <table style={{color:'#505050', 'borderSpacing': '25px 0px'}}>
                        <tr><td>sweep:</td> <td>Specify if current initialization is for a sweep.</td></tr>
                        <tr><td>sweep_name:</td> <td>If sweep == True, specify sweep name.</td></tr>
                        <tr><td>run_name:</td> <td>If current initialization is for a run (sweep == False), specify run name.</td></tr>
                        <tr><td>save_files:</td> <td>If save_files == True, all python and jupyter notebooks within the working directory are saved.</td></tr>
                      </table>
                    </ul>
                  </li>

                  </ol>

                  <p style={{fontFamily: 'Helvetica, Arial, sans-serif', fontWeight:'bold', fontSize:'30px', color: '#18191a'}}> Functions </p>

                  <ol type="a">
                  <li style={{marginBottom:'30px'}}>
                    To log csv file information (Null Values, Unique Values, Column Names etc). Note, this does not save the actual data.
                    <ul style={{color:'purple', fontWeight:'bold', marginTop:'5px'}}>
                      <li style={{marginBottom:'10px'}}><code>mynacode.csv(dataframe=None, node_name="CSV", run_id=None)</code></li>
                    
                      <table style={{color:'#505050', 'borderSpacing': '25px 0px'}}>
                        <tr><td>username</td> <td>Account username.</td></tr>
                        <tr><td>key:</td> <td>Account key.</td></tr>
                      </table>

                    </ul>
                  </li>

                  <li style={{marginBottom:'30px'}}> 
                    To save project dataset on your local machine and log dataset path. 
                    If there are changes in the dataset, it automatically saves the dataset with a new filename on your local machine. 
                    
                    <div style={{marginTop:'15px', fontWeight: 'bold'}}>PyTorch Dataloaders</div>

                    <ul style={{color:'purple', fontWeight:'bold', marginTop:'5px'}}>
                      <li style={{color:'purple', fontWeight:'bold', marginBottom:'20px'}}><code>mynacode.torch_dataloader(train=None, val=None, test=None, dataset_name="", label_index=1,
         node_name="Datasets", if_sweep_save_once=True, run_id=None)</code></li>
                    
                      <table style={{color:'#505050', 'borderSpacing': '25px 0px'}}>
                        <tr><td>train:</td> <td>Train dataloader object.</td></tr>
                        <tr><td>val:</td> <td>Val dataloader object.</td></tr>
                        <tr><td>test:</td> <td>Test dataloader object.</td></tr>
                        <tr><td>dataset_name:</td> <td>Dataset name (This will be the name of the local directory where the datasets are stored).</td></tr>
                        <tr><td>label_index:</td> <td>Index of labels in the dataloader object.</td></tr>
                        <tr><td>node_name:</td> <td>Node to store dataset path information.</td></tr>
                        <tr><td>if_sweep_save_once:</td> <td>In hyperparameter sweeps, datasets will only be saved once for optimization.</td></tr>
                        <tr><td>run_id:</td> <td>Run ID to log dataset paths. If None, the run ID generated automatically after calling the init function will be used.</td></tr>
                      </table>
                    </ul>

                    <div style={{marginTop:'10px', fontWeight: 'bold'}}>NumPy Datasets</div>

                    <ul style={{color:'purple', fontWeight:'bold', marginTop:'5px'}}>
                      <li style={{color:'purple', fontWeight:'bold', marginBottom:'20px'}}><code>mynacode.np_data(train=[], train_labels=[], val=[], val_labels=[], test=[], test_labels=[], dataset_name="",
         node_name="Datasets", if_sweep_save_once=True, run_id=None)</code></li>
                    
                      <table style={{color:'#505050', 'borderSpacing': '25px 0px'}}>
                        <tr><td>train:</td> <td>NumPy array for the training dataset.</td></tr>
                        <tr><td>train_labels:</td> <td>NumPy array for the training labels.</td></tr>
                        <tr><td>val:</td> <td>NumPy array for the validation dataset.</td></tr>
                        <tr><td>val_labels:</td> <td>NumPy array for the validation labels.</td></tr>
                        <tr><td>test:</td> <td>NumPy array for the testing dataset.</td></tr>
                        <tr><td>test_labels:</td> <td>NumPy array for the testing labels.</td></tr>
                        <tr><td>dataset_name:</td> <td>Dataset name (This will be the name of the local directory where the datasets are stored).</td></tr>
                        <tr><td>node_name:</td> <td>Node to store dataset path information.</td></tr>
                        <tr><td>if_sweep_save_once:</td> <td>In hyperparameter sweeps, datasets will only be saved once for optimization.</td></tr>
                        <tr><td>run_id:</td> <td>Run ID to log dataset paths. If None, the run ID generated automatically after calling the init function will be used.</td></tr>
                      </table>
                    </ul>

                  </li>


                  <li style={{marginBottom:'30px'}}> 
                    To log a dictionary of model configuration parameters. 
                    <ul style={{color:'purple', fontWeight:'bold', marginTop:'5px'}}>
                      <li style={{color:'purple', fontWeight:'bold', marginBottom:'20px'}}><code>mynacode.config(config_dict=&#123;&#125;, node_name="Datasets", run_id=None)</code></li>
                    
                      <table style={{color:'#505050', 'borderSpacing': '25px 0px'}}>
                        <tr><td>config_dict:</td> <td>Parameter configuration dictionary.</td></tr>
                        <tr><td>node_name:</td> <td>Node to store configuration.</td></tr>
                        <tr><td>run_id:</td> <td>Run ID to log dataset paths. If None, the run ID generated automatically after calling the init function will be used.</td></tr>
                      </table>
                    </ul>
                  </li>


                  <li style={{marginBottom:'30px'}}> 
                    To record model performance metrics. 
                    <ul style={{color:'purple', fontWeight:'bold', marginTop:'5px'}}>
                      <li style={{color:'purple', fontWeight:'bold', marginBottom:'20px'}}><code>mynacode.torch_model(model=None, metric_name=None, metric_value=None, goal='maximize', current_epoch=None, track=&#123;&#125;, run_id=None)</code></li>
                    
                      <table style={{color:'#505050', 'borderSpacing': '25px 0px'}}>
                        <tr><td>model:</td> <td>Pytorch Model.</td></tr>
                        <tr><td>metric_name:</td> <td>Key metric name for evaluating model performance.</td></tr>
                        <tr><td>metric_value:</td> <td>Key metric value for evaluating model performance.</td></tr>
                        <tr><td>goal:</td> <td>Goal of evaluation (minimize or maximize key metric).</td></tr>
                        <tr><td>current_epoch:</td> <td>Current Epoch.</td></tr>
                        <tr><td>track:</td> <td>Dictionary of model parameters to monitor. The parameters for the best model will be logged.</td></tr>
                        <tr><td>run_id:</td> <td>Run ID to log dataset paths. If None, the run ID generated automatically after calling the init function will be used.</td></tr>
                      </table>
                    </ul>
                  </li>


                  <li style={{marginBottom:'30px'}}> 
                    To save best model. 
                    <ul style={{color:'purple', fontWeight:'bold', marginTop:'5px'}}>
                      <li style={{color:'purple', fontWeight:'bold', marginBottom:'20px'}}><code>mynacode.torch_save_best()</code></li>
                    </ul>
                  </li>





                  <li style={{marginBottom:'30px'}}> 
                    To log test dataset results (Senstivity, Specificity, AUC etc). 
                    <ul style={{color:'purple', fontWeight:'bold', marginTop:'5px'}}>
                      <li style={{color:'purple', fontWeight:'bold', marginBottom:'20px'}}><code>mynacode.results(y_true=[], y_pred=[], threshold=0.5, results_dict=&#123;&#125;, node_name="Results", problem_type='binary classification', run_id=None)</code></li>
                    
                      <table style={{color:'#505050', 'borderSpacing': '25px 0px'}}>
                        <tr><td>y_true:</td> <td>Numpy array of truth labels.</td></tr>
                        <tr><td>y_pred:</td> <td>Numpy array of predicted values.</td></tr>
                        <tr><td>threshold:</td> <td>Threshold for the binary classification.</td></tr>
                        <tr><td>results_dict:</td> <td>Dictionary of any additional results metric-value pairs.</td></tr>
                        <tr><td>node_name:</td> <td>Index of labels in the dataloader object.</td></tr>
                        <tr><td>problem_type:</td> <td>Problem type.</td></tr>
                        <tr><td>node_name:</td> <td>Node to store model results.</td></tr>
                        <tr><td>run_id:</td> <td>Run ID to log dataset paths. If None, the run ID generated automatically after calling the init function will be used.</td></tr>
                      </table>
                    </ul>
                  </li>

                  </ol>
                </div>

              </div>
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

                  <li style={{marginBottom:'30px'}}>
                    Create a new Project. 
                    <ul style={{color:'purple', fontWeight:'bold', marginTop:'5px'}}>
                      <li style={{marginBottom:'10px'}}><code>mynacode.start(base_folder='', project='')</code></li>
                    
                      <table style={{color:'#505050', 'borderSpacing': '25px 0px'}}>
                        <tr><td>base_folder:</td> <td>Base directory path of your project.</td></tr>
                        <tr><td>project:</td> <td>Name of the project.</td></tr>
                      </table>
                    </ul>
                  </li>


                  <li style={{marginBottom:'30px'}}>
                    Initialize a Run or a Sweep. 
                    <ul style={{color:'purple', fontWeight:'bold', marginTop:'5px'}}>
                      <li style={{marginBottom:'10px'}}><code>mynacode.init(sweep = False, sweep_name = "", run_name="", save_files = False)</code></li>
                    
                      <table style={{color:'#505050', 'borderSpacing': '25px 0px'}}>
                        <tr><td>sweep:</td> <td>Specify if current initialization is for a sweep.</td></tr>
                        <tr><td>sweep_name:</td> <td>If sweep == True, specify sweep name.</td></tr>
                        <tr><td>run_name:</td> <td>If current initialization is for a run (sweep == False), specify run name.</td></tr>
                        <tr><td>save_files:</td> <td>If save_files == True, all python and jupyter notebooks within the working directory are saved.</td></tr>
                      </table>
                    </ul>
                  </li>


                  </ol>

                  <p style={{fontFamily: 'Helvetica, Arial, sans-serif', fontWeight:'bold', fontSize:'30px', color: '#18191a'}}> Functions </p>

                  <ol type="a">
                  <li style={{marginBottom:'30px'}}>
                    To log csv file information (Null Values, Unique Values, Column Names etc). Note, this does not save the actual data.
                    <ul style={{color:'purple', fontWeight:'bold', marginTop:'5px'}}>
                      <li style={{marginBottom:'10px'}}><code>mynacode.csv(dataframe=None, node_name="CSV", run_id=None)</code></li>
                    
                      <table style={{color:'#505050', 'borderSpacing': '25px 0px'}}>
                        <tr><td>username</td> <td>Account username.</td></tr>
                        <tr><td>key:</td> <td>Account key.</td></tr>
                      </table>

                    </ul>
                  </li>

                  <li style={{marginBottom:'30px'}}> 
                    To save project dataset on your local machine and log dataset path.
                    If there are changes in the dataset, it automatically saves the dataset with a new filename on your local machine. 
                    
                    <div style={{marginTop:'15px', fontWeight: 'bold'}}>Tensorflow Datasets</div>

                    <ul style={{color:'purple', fontWeight:'bold', marginTop:'5px'}}>
                      <li style={{color:'purple', fontWeight:'bold', marginBottom:'20px'}}><code>mynacode.tf_dataset(train=None, val=None, test=None, dataset_name="", label_index=1,
         node_name="Datasets", if_sweep_save_once=True, run_id=None)</code></li>
                    
                      <table style={{color:'#505050', 'borderSpacing': '25px 0px'}}>
                        <tr><td>train:</td> <td>Train dataset object.</td></tr>
                        <tr><td>val:</td> <td>Val dataset object.</td></tr>
                        <tr><td>test:</td> <td>Test dataset object.</td></tr>
                        <tr><td>dataset_name:</td> <td>Dataset name (This will be the name of the local directory where the datasets are stored).</td></tr>
                        <tr><td>label_index:</td> <td>Index of labels in the dataloader object.</td></tr>
                        <tr><td>node_name:</td> <td>Node to store dataset path information.</td></tr>
                        <tr><td>if_sweep_save_once:</td> <td>In hyperparameter sweeps, datasets will only be saved once for optimization.</td></tr>
                        <tr><td>run_id:</td> <td>Run ID to log dataset paths. If None, the run ID generated automatically after calling the init function will be used.</td></tr>
                      </table>
                    </ul>


                    <div style={{marginTop:'10px', fontWeight: 'bold'}}>NumPy Datasets</div>

                    <ul style={{color:'purple', fontWeight:'bold', marginTop:'5px'}}>
                      <li style={{color:'purple', fontWeight:'bold', marginBottom:'20px'}}><code>mynacode.np_data(train=[], train_labels=[], val=[], val_labels=[], test=[], test_labels=[], dataset_name="",
         node_name="Datasets", if_sweep_save_once=True, run_id=None)</code></li>
                    
                      <table style={{color:'#505050', 'borderSpacing': '25px 0px'}}>
                        <tr><td>train:</td> <td>NumPy array for the training dataset.</td></tr>
                        <tr><td>train_labels:</td> <td>NumPy array for the training labels.</td></tr>
                        <tr><td>val:</td> <td>NumPy array for the validation dataset.</td></tr>
                        <tr><td>val_labels:</td> <td>NumPy array for the validation labels.</td></tr>
                        <tr><td>test:</td> <td>NumPy array for the testing dataset.</td></tr>
                        <tr><td>test_labels:</td> <td>NumPy array for the testing labels.</td></tr>
                        <tr><td>dataset_name:</td> <td>Dataset name (This will be the name of the local directory where the datasets are stored).</td></tr>
                        <tr><td>node_name:</td> <td>Node to store dataset path information.</td></tr>
                        <tr><td>if_sweep_save_once:</td> <td>In hyperparameter sweeps, datasets will only be saved once for optimization.</td></tr>
                        <tr><td>run_id:</td> <td>Run ID to log dataset paths. If None, the run ID generated automatically after calling the init function will be used.</td></tr>
                      </table>
                    </ul>
                  </li>


                  <li style={{marginBottom:'30px'}}> 
                    To log a dictionary of model configuration parameters. 
                    <ul style={{color:'purple', fontWeight:'bold', marginTop:'5px'}}>
                      <li style={{color:'purple', fontWeight:'bold', marginBottom:'20px'}}><code>mynacode.config(config_dict=&#123;&#125;, node_name="Datasets", run_id=None)</code></li>
                    
                      <table style={{color:'#505050', 'borderSpacing': '25px 0px'}}>
                        <tr><td>config_dict:</td> <td>Parameter configuration dictionary.</td></tr>
                        <tr><td>node_name:</td> <td>Node to store configuration.</td></tr>
                        <tr><td>run_id:</td> <td>Run ID to log dataset paths. If None, the run ID generated automatically after calling the init function will be used.</td></tr>
                      </table>
                    </ul>
                  </li>


                  <li style={{marginBottom:'30px'}}> 
                    To record model performance metrics, add this callback in the callbacks list parameter of the model.fit function. 
                    <ul style={{color:'purple', fontWeight:'bold', marginTop:'5px'}}>
                      <li style={{color:'purple', fontWeight:'bold', marginBottom:'20px'}}><code>  mynacode.MynacodeCallback(metric_name, goal='maximize', track=&#123;&#125;, run_id=None) </code></li>
                    
                      <table style={{color:'#505050', 'borderSpacing': '25px 0px'}}>
                        <tr><td>metric_name:</td> <td>Key metric name for evaluating model performance.</td></tr>
                        <tr><td>goal:</td> <td>Goal of evaluation (minimize or maximize key metric).</td></tr>
                        <tr><td>track:</td> <td>Dictionary of model parameters to monitor. The parameters for the best model will be logged.</td></tr>
                        <tr><td>run_id:</td> <td>Run ID to log dataset paths. If None, the run ID generated automatically after calling the init function will be used.</td></tr>
                      </table>
                    </ul>
                  </li>


                  <li style={{marginBottom:'30px'}}> 
                    To log test dataset results (Senstivity, Specificity, AUC etc). 
                    <ul style={{color:'purple', fontWeight:'bold', marginTop:'5px'}}>
                      <li style={{color:'purple', fontWeight:'bold', marginBottom:'20px'}}><code>mynacode.results(y_true=[], y_pred=[], threshold=0.5, results_dict=&#123;&#125;, node_name="Results", problem_type='binary classification', run_id=None)</code></li>
                    
                      <table style={{color:'#505050', 'borderSpacing': '25px 0px'}}>
                        <tr><td>y_true:</td> <td>Numpy array of truth labels.</td></tr>
                        <tr><td>y_pred:</td> <td>Numpy array of predicted values.</td></tr>
                        <tr><td>threshold:</td> <td>Threshold for the binary classification.</td></tr>
                        <tr><td>results_dict:</td> <td>Dictionary of any additional results metric-value pairs.</td></tr>
                        <tr><td>node_name:</td> <td>Index of labels in the dataloader object.</td></tr>
                        <tr><td>problem_type:</td> <td>Problem type.</td></tr>
                        <tr><td>node_name:</td> <td>Node to store model results.</td></tr>
                        <tr><td>run_id:</td> <td>Run ID to log dataset paths. If None, the run ID generated automatically after calling the init function will be used.</td></tr>
                      </table>
                    </ul>
                  </li>

                  </ol>
                </div>

              </div>
      },
    ]}
  />

        </Layout>
      </Content>

    </Layout>



  );
  
};

export default Docs;