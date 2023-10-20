import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import IP, {IP_image} from "../components/ipConfig";
import { Link } from 'react-router-dom';
import { Layout, Menu, Divider, Tabs} from 'antd';
import CreateGraph from "../components/CreateGraph";
import { LeftCircleOutlined } from '@ant-design/icons';
import protocol from "../components/httpORhttps";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';



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


                  <li style={{marginBottom:'30px'}}>
                      Only for sweeps. Insert this after completing a training cycle (all epochs) for a specific set of hyperparameters. This resets the variables for the next model within the sweep.
                     <ul style={{color:'purple', fontWeight:'bold', marginTop:'5px'}}>
                        <li style={{marginBottom:'10px'}}><code>mynacode.torch_reset()</code></li>
                      </ul>
                  </li>

                  </ol>

                  <p style={{fontFamily: 'Helvetica, Arial, sans-serif', fontWeight:'bold', fontSize:'30px', color: '#18191a'}}> Functions </p>

                  <ol type="a">
                  <li style={{marginBottom:'30px'}}>
                    To log csv file information such as null value count, unique value count, column names and datatypes. Note, this does not save the actual data.
                    <ul style={{color:'purple', fontWeight:'bold', marginTop:'5px'}}>
                      <li style={{marginBottom:'10px'}}><code>mynacode.csv(dataframe=None, run_id=None)</code></li>
                    
                      <table style={{color:'#505050', 'borderSpacing': '25px 0px'}}>
                        <tr><td>dataframe</td> <td>Dataframe object.</td></tr>
                        <tr><td>run_id:</td> <td>The ID of the current Run. If None, the run ID generated automatically after calling the init function will be used.</td></tr>                      
                      </table>

                    </ul>
                  </li>

                  <li style={{marginBottom:'30px'}}> 
                    To save project dataset on your local machine and log dataset path. 
                    If there are changes in the dataset, it automatically saves the dataset with a new filename on your local machine. 
                    
                    <div style={{marginTop:'15px', fontWeight: 'bold'}}>PyTorch Dataloaders</div>

                    <ul style={{color:'purple', fontWeight:'bold', marginTop:'5px'}}>
                      <li style={{color:'purple', fontWeight:'bold', marginBottom:'20px'}}><code>mynacode.torch_dataloader(train=None, val=None, test=None, dataset_name="", label_index=1,
         if_sweep_save_once=True, run_id=None)</code></li>
                    
                      <table style={{color:'#505050', 'borderSpacing': '25px 0px'}}>
                        <tr><td>train:</td> <td>Train dataloader object.</td></tr>
                        <tr><td>val:</td> <td>Val dataloader object.</td></tr>
                        <tr><td>test:</td> <td>Test dataloader object.</td></tr>
                        <tr><td>dataset_name:</td> <td>Dataset name (This will be the name of the local directory where the datasets are stored).</td></tr>
                        <tr><td>label_index:</td> <td>Index of labels in the dataloader object.</td></tr>
                        <tr><td>if_sweep_save_once:</td> <td>In hyperparameter sweeps, datasets will only be saved once for optimization.</td></tr>
                        <tr><td>run_id:</td> <td>The ID of the current Run. If None, the run ID generated automatically after calling the init function will be used.</td></tr>
                      </table>
                    </ul>

                    <div style={{marginTop:'10px', fontWeight: 'bold'}}>NumPy Datasets</div>

                    <ul style={{color:'purple', fontWeight:'bold', marginTop:'5px'}}>
                      <li style={{color:'purple', fontWeight:'bold', marginBottom:'20px'}}><code>mynacode.np_data(train=[], train_labels=[], val=[], val_labels=[], test=[], test_labels=[], dataset_name="",
         if_sweep_save_once=True, run_id=None)</code></li>
                    
                      <table style={{color:'#505050', 'borderSpacing': '25px 0px'}}>
                        <tr><td>train:</td> <td>NumPy array for the training dataset.</td></tr>
                        <tr><td>train_labels:</td> <td>NumPy array for the training labels.</td></tr>
                        <tr><td>val:</td> <td>NumPy array for the validation dataset.</td></tr>
                        <tr><td>val_labels:</td> <td>NumPy array for the validation labels.</td></tr>
                        <tr><td>test:</td> <td>NumPy array for the testing dataset.</td></tr>
                        <tr><td>test_labels:</td> <td>NumPy array for the testing labels.</td></tr>
                        <tr><td>dataset_name:</td> <td>Dataset name (This will be the name of the local directory where the datasets are stored).</td></tr>
                        <tr><td>if_sweep_save_once:</td> <td>In hyperparameter sweeps, datasets will only be saved once for optimization.</td></tr>
                        <tr><td>run_id:</td> <td>The ID of the current Run. If None, the run ID generated automatically after calling the init function will be used.</td></tr>                      
                      </table>
                    </ul>

                  </li>


                  <li style={{marginBottom:'30px'}}> 
                    To log a dictionary of model configuration parameters. 
                    <ul style={{color:'purple', fontWeight:'bold', marginTop:'5px'}}>
                      <li style={{color:'purple', fontWeight:'bold', marginBottom:'20px'}}><code>mynacode.config(config_dict=&#123;&#125;, run_id=None)</code></li>
                    
                      <table style={{color:'#505050', 'borderSpacing': '25px 0px'}}>
                        <tr><td>config_dict:</td> <td>Parameter configuration dictionary.</td></tr>
                        <tr><td>run_id:</td> <td>The ID of the current Run. If None, the run ID generated automatically after calling the init function will be used.</td></tr>                      
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
                        <tr><td>run_id:</td> <td>The ID of the current Run. If None, the run ID generated automatically after calling the init function will be used.</td></tr>                      
                      </table>
                    </ul>
                  </li>


                  <li style={{marginBottom:'30px'}}> 
                    To log test dataset results (Senstivity, Specificity, AUC etc). 
                    <ul style={{color:'purple', fontWeight:'bold', marginTop:'5px'}}>
                      <li style={{color:'purple', fontWeight:'bold', marginBottom:'20px'}}><code>mynacode.results(y_true=[], y_pred=[], threshold=0.5, results_dict=&#123;&#125;, problem_type='binary classification', run_id=None)</code></li>
                    
                      <table style={{color:'#505050', 'borderSpacing': '25px 0px'}}>
                        <tr><td>y_true:</td> <td>Numpy array of truth labels.</td></tr>
                        <tr><td>y_pred:</td> <td>Numpy array of predicted values.</td></tr>
                        <tr><td>threshold:</td> <td>Threshold for the binary classification.</td></tr>
                        <tr><td>results_dict:</td> <td>Dictionary of any additional results metric-value pairs.</td></tr>
                        <tr><td>problem_type:</td> <td>Problem type.</td></tr>
                        <tr><td>run_id:</td> <td>The ID of the current Run. If None, the run ID generated automatically after calling the init function will be used.</td></tr>                      
                      </table>
                    </ul>
                  </li>

                  </ol>

<h3>Code Example</h3>

<SyntaxHighlighter language="python" style={vscDarkPlus}>

{`import torch
import torch.nn as nn
import torchvision
from torch.utils.data import Dataset, DataLoader, ConcatDataset
from torchmetrics import AUROC
import torch.nn.functional as F

import mynacode
mynacode.login("aaa", "1688106171XETpdKLRwJ")
mynacode.start(project = "MNIST3")

def load_data():
  batch_size = 64
  random_seed = 5

  all_data =   torchvision.datasets.MNIST('/files/', train=True, download=True,
                              transform=torchvision.transforms.Compose([
                                torchvision.transforms.ToTensor(),
                                torchvision.transforms.Normalize(
                                  (0.1307,), (0.3081,))
                              ]))

  data, not_data = torch.utils.data.random_split(all_data, [1000, 59000], generator=torch.Generator().manual_seed(random_seed))
  val, train_1  = torch.utils.data.random_split(data, [150, 850], generator=torch.Generator().manual_seed(random_seed))
  test, train  = torch.utils.data.random_split(train_1, [150, 700], generator=torch.Generator().manual_seed(random_seed))

  train_loader = torch.utils.data.DataLoader(train, batch_size=batch_size, shuffle=True)
  test_loader = torch.utils.data.DataLoader(test, batch_size=batch_size, shuffle=True)
  val_loader = torch.utils.data.DataLoader(val, batch_size=batch_size, shuffle=True)

  return train_loader, test_loader, val_loader

train_loader, test_loader, val_loader = load_data()

mynacode.init(save_files = True, run_name="MNIST_run")
mynacode.torch_dataloader(train=val_loader, val=val_loader, label_index=1, dataset_name="MNIST_data")

class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        self.conv1 = nn.Conv2d(1, 10, kernel_size=5)
        self.conv2 = nn.Conv2d(10, 20, kernel_size=5)
        self.fc1 = nn.Linear(320, 50)
        self.fc2 = nn.Linear(50, 10)

    def forward(self, x):
        x = F.relu(F.max_pool2d(self.conv1(x), 2))
        x = F.relu(F.max_pool2d(self.conv2(x), 2))
        x = x.view(-1, 320)
        x = F.relu(self.fc1(x))
        x = self.fc2(x)
        return F.log_softmax(x, dim=1)

network = Net()
epochs = 10
start_lr = 1e-3
momentum = 0.5
optimizer = torch.optim.SGD(network.parameters(), lr=start_lr, momentum=momentum)
lr_scheduler = torch.optim.lr_scheduler.ExponentialLR(optimizer, gamma=1.017)
network.train()
train_loss = 0
auroc = AUROC(task='binary')

for epoch in range(epochs):
  print('Epoch: ', epoch)
  train_loss = 0
  for batch_idx, (data, target) in enumerate(train_loader):
    optimizer.zero_grad()
    output = network(data)
    target = target.unsqueeze(1).float()
    loss = F.binary_cross_entropy(output, target)
    train_loss += loss.item()
    loss.backward()
    optimizer.step()
    lr_scheduler.step()

  network.eval()
  voutput_list = []
  vtarget_list = []

  with torch.no_grad():
    for vbatch_idx, (vdata, vtarget) in enumerate(val_loader):
      voutput_list.append(network(vdata))
      vtarget_list.append(vtarget)

  val_auc = auroc(torch.cat(voutput_list), torch.cat(vtarget_list))

  mynacode.torch_model(model=network, model_name=str(epoch)+'model', metric_name="val auc", metric_value=val_auc, goal='maximize', current_epoch = epoch)

model = Net()
checkpoint = torch.load('mynacode/MNIST3/R411_MNIST_run/model/model_epoch_8.pt')
model.load_state_dict(checkpoint)

toutput_list = []
ttarget_list = []

with torch.no_grad():
  for tbatch_idx, (tdata, ttarget) in enumerate(test_loader):
    toutput_list.append(model(tdata))
    ttarget_list.append(ttarget)

mynacode.results(y_true = torch.cat(ttarget_list), y_pred = torch.cat(toutput_list), threshold=0.5)`}
</SyntaxHighlighter>

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
                    To log csv file information such as null value count, unique value count, column names and datatypes. Note, this does not save the actual data.
                    <ul style={{color:'purple', fontWeight:'bold', marginTop:'5px'}}>
                      <li style={{marginBottom:'10px'}}><code>mynacode.csv(dataframe=None, run_id=None)</code></li>
                    
                      <table style={{color:'#505050', 'borderSpacing': '25px 0px'}}>
                        <tr><td>dataframe</td> <td>Dataframe object.</td></tr>
                        <tr><td>run_id:</td> <td>The ID of the current Run. If None, the run ID generated automatically after calling the init function will be used.</td></tr>                      
                      </table>

                    </ul>
                  </li>

                  <li style={{marginBottom:'30px'}}> 
                    To save project dataset on your local machine and log dataset path.
                    If there are changes in the dataset, it automatically saves the dataset with a new filename on your local machine. 
                    
                    <div style={{marginTop:'15px', fontWeight: 'bold'}}>Tensorflow Datasets</div>

                    <ul style={{color:'purple', fontWeight:'bold', marginTop:'5px'}}>
                      <li style={{color:'purple', fontWeight:'bold', marginBottom:'20px'}}><code>mynacode.tf_dataset(train=None, val=None, test=None, dataset_name="", label_index=1,
         if_sweep_save_once=True, run_id=None)</code></li>
                    
                      <table style={{color:'#505050', 'borderSpacing': '25px 0px'}}>
                        <tr><td>train:</td> <td>Train dataset object.</td></tr>
                        <tr><td>val:</td> <td>Val dataset object.</td></tr>
                        <tr><td>test:</td> <td>Test dataset object.</td></tr>
                        <tr><td>dataset_name:</td> <td>Dataset name (This will be the name of the local directory where the datasets are stored).</td></tr>
                        <tr><td>label_index:</td> <td>Index of labels in the dataloader object.</td></tr>
                        <tr><td>if_sweep_save_once:</td> <td>In hyperparameter sweeps, datasets will only be saved once for optimization.</td></tr>
                        <tr><td>run_id:</td> <td>The ID of the current Run. If None, the run ID generated automatically after calling the init function will be used.</td></tr>
                      </table>
                    </ul>


                    <div style={{marginTop:'10px', fontWeight: 'bold'}}>NumPy Datasets</div>

                    <ul style={{color:'purple', fontWeight:'bold', marginTop:'5px'}}>
                      <li style={{color:'purple', fontWeight:'bold', marginBottom:'20px'}}><code>mynacode.np_data(train=[], train_labels=[], val=[], val_labels=[], test=[], test_labels=[], dataset_name="",
         if_sweep_save_once=True, run_id=None)</code></li>
                    
                      <table style={{color:'#505050', 'borderSpacing': '25px 0px'}}>
                        <tr><td>train:</td> <td>NumPy array for the training dataset.</td></tr>
                        <tr><td>train_labels:</td> <td>NumPy array for the training labels.</td></tr>
                        <tr><td>val:</td> <td>NumPy array for the validation dataset.</td></tr>
                        <tr><td>val_labels:</td> <td>NumPy array for the validation labels.</td></tr>
                        <tr><td>test:</td> <td>NumPy array for the testing dataset.</td></tr>
                        <tr><td>test_labels:</td> <td>NumPy array for the testing labels.</td></tr>
                        <tr><td>dataset_name:</td> <td>Dataset name (This will be the name of the local directory where the datasets are stored).</td></tr>
                        <tr><td>if_sweep_save_once:</td> <td>In hyperparameter sweeps, datasets will only be saved once for optimization.</td></tr>
                        <tr><td>run_id:</td> <td>The ID of the current Run. If None, the run ID generated automatically after calling the init function will be used.</td></tr>
                      </table>
                    </ul>
                  </li>


                  <li style={{marginBottom:'30px'}}> 
                    To log a dictionary of model configuration parameters. 
                    <ul style={{color:'purple', fontWeight:'bold', marginTop:'5px'}}>
                      <li style={{color:'purple', fontWeight:'bold', marginBottom:'20px'}}><code>mynacode.config(config_dict=&#123;&#125;, run_id=None)</code></li>
                    
                      <table style={{color:'#505050', 'borderSpacing': '25px 0px'}}>
                        <tr><td>config_dict:</td> <td>Parameter configuration dictionary.</td></tr>
                        <tr><td>run_id:</td> <td>The ID of the current Run. If None, the run ID generated automatically after calling the init function will be used.</td></tr>
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
                        <tr><td>run_id:</td> <td>The ID of the current Run. If None, the run ID generated automatically after calling the init function will be used.</td></tr>
                      </table>
                    </ul>
                  </li>


                  <li style={{marginBottom:'30px'}}> 
                    To log test dataset results (Senstivity, Specificity, AUC etc). 
                    <ul style={{color:'purple', fontWeight:'bold', marginTop:'5px'}}>
                      <li style={{color:'purple', fontWeight:'bold', marginBottom:'20px'}}><code>mynacode.results(y_true=[], y_pred=[], threshold=0.5, results_dict=&#123;&#125;, problem_type='binary classification', run_id=None)</code></li>
                    
                      <table style={{color:'#505050', 'borderSpacing': '25px 0px'}}>
                        <tr><td>y_true:</td> <td>Numpy array of truth labels.</td></tr>
                        <tr><td>y_pred:</td> <td>Numpy array of predicted values.</td></tr>
                        <tr><td>threshold:</td> <td>Threshold for the binary classification.</td></tr>
                        <tr><td>results_dict:</td> <td>Dictionary of any additional results metric-value pairs.</td></tr>
                        <tr><td>problem_type:</td> <td>Problem type.</td></tr>
                        <tr><td>run_id:</td> <td>The ID of the current Run. If None, the run ID generated automatically after calling the init function will be used.</td></tr>
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