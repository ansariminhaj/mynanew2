import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import IP from "../components/ipConfig";
import { useNavigate, Link } from 'react-router-dom';
import { Divider, message, Button, Tooltip, Popover, Checkbox, Form, Input, Alert, Modal, Switch, Dropdown, Menu, Upload } from 'antd';
import { PlusCircleOutlined, EditOutlined, AlignLeftOutlined, ApartmentOutlined, FileImageOutlined, CloseOutlined, CheckOutlined, DesktopOutlined, InboxOutlined, FileOutlined, UploadOutlined } from '@ant-design/icons';
import '../components/index.css';
import protocol from "../components/httpORhttps";
import * as actions from '../store/actions/actions';
import { connect } from 'react-redux';
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart }            from 'react-chartjs-2'

const { TextArea } = Input;
const { Dragger } = Upload;

const layout = {
  labelCol: {
    span: 2,
  },
  wrapperCol: {
    span: 18,
  },
};


const bar_options = {
  scales: {
    x: {
      type: "linear",
      offset: false,
      gridLines: {
        offsetGridLines: false
      },
      title: {
        display: true,
        text: "Predictions"
      }
    },

    y: {
      title: {
        display: true,
        text: "Frequency"
      }
    }
  }
};

const line_options = {
  scales: {
    x: {
      type: "linear",
      offset: false,
      gridLines: {
        offsetGridLines: false
      },
      title: {
        display: true,
        text: "FPR"
      }
    },
    y: {
      title: {
        display: true,
        text: "TPR"
      }
    }
  }
};



const CreateGraph = (props) => {
  const navigate = useNavigate()
  const [nodeBorder, setNodeBorder] = useState([])
  const [refresh, setRefresh] = useState(0)
  const [isCreateNodeModalOpen, setIsCreateNodeModalOpen] = useState(false);
  const [isDeleteNodeModalOpen, setIsDeleteNodeModalOpen] = useState(false);
  const [showUploadProgress, setshowUploadProgress] = useState(false)
  const [showFileUploadProgress, setshowFileUploadProgress] = useState(false)
  const [files, setFiles] = useState()
  const [images, setImages] = useState()

  const [variableNodes, setVariableNodes] = useState([])
  const [csvNodes, setCSVNodes] = useState([])
  const [datasetNodes, setDatasetNodes] = useState([])
  const [methodNodes, setMethodNodes] = useState([])
  const [resultNodes, setResultNodes] = useState([])
  const [objectiveNodes, setObjectiveNodes] = useState([])
  const [nodeViewModalDict, setNodeViewModalDict] = useState({})
  const [editNodeViewModalDict, setEditNodeViewModalDict] = useState({})
  const [addKeyValueDict, setAddKeyValueDict] = useState({})
  const [editNodeID, setEditNodeID] = useState(-1);

  const [systemInfo, setSystemInfo] = useState([]);
  const [libraries, setLibraries] = useState([]);
  const [filepaths, setFilepaths] = useState([]);
  const [freq, setFreq] = useState([]);
  const [bins, setBins] = useState([]);
  const [fpr, setTpr] = useState([]);
  const [tpr, setFpr] = useState([]);

  const [form] = Form.useForm();

  const colors = ['#34568B', '#FF6F61', '#6B5B95', '#75675E', '#88B04B', '#F7CAC9', '#92A8D1', '#955251', '#324F17', '#EEAD0E',
  '#B565A7', '#009B77', '#DD4124', '#BAAF07', '#D65076', '#45B8AC', '#EFC050', '#777733', '#5B5EA6', '#9B2335', '#DFCFBE', '#55B4B0',
  '#E15D44', '#5C3317', '#8B8682','#9CCB19']




  const onFinish = (values)  => {
    let form_data = new FormData();

    console.log(values)

    for (const [key, value] of Object.entries(values))
      form_data.append(key, value)

    var csrftoken = Cookies.get('csrftoken');
    axios({
      withCredentials: true,
      method: 'post',
      url: protocol+'://'+IP+'/api/token/refresh/',
      data: {'refresh': localStorage.getItem('refresh_token')},
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken}} ) 
    .then(res =>{
      localStorage.setItem('access_token', res.data["access"])
      localStorage.setItem('refresh_token', res.data["refresh"])
      axios({
        withCredentials: true,
        method: 'post',
        url: protocol+'://'+IP+'/api/update_node_info',
        data: form_data,
        headers: {
          'Authorization': "JWT " + localStorage.getItem('access_token'),
          'Content-Type': 'application/json',
          'content-type': 'multipart/form-data',
          'X-CSRFToken': csrftoken}} )
      .then(res => {
        setRefresh((prevValue) => prevValue + 1) 
      })
    })
    .catch(err => {
      console.log(err.response.data);
      navigate("/login")
    })
  }


  const onFinishKeyValue = (values)  => {
    let form_data = new FormData();

    console.log(values)

    for (const [key, value] of Object.entries(values))
      form_data.append(key, value)

    var csrftoken = Cookies.get('csrftoken');
    axios({
      withCredentials: true,
      method: 'post',
      url: protocol+'://'+IP+'/api/token/refresh/',
      data: {'refresh': localStorage.getItem('refresh_token')},
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken}} ) 
    .then(res =>{
      localStorage.setItem('access_token', res.data["access"])
      localStorage.setItem('refresh_token', res.data["refresh"])
      axios({
        withCredentials: true,
        method: 'post',
        url: protocol+'://'+IP+'/api/add_key_value',
        data: form_data,
        headers: {
          'Authorization': "JWT " + localStorage.getItem('access_token'),
          'Content-Type': 'application/json',
          'content-type': 'multipart/form-data',
          'X-CSRFToken': csrftoken}} )
      .then(res => {
        setRefresh((prevValue) => prevValue + 1) 
      })
    })
    .catch(err => {
      console.log(err.response.data);
      navigate("/login")
    })
  }


 const imageUpload = (file) => {
    let data = {}

    if (file) {
        data = {'run_id': props.run_id, 'image': file}
    } 
    else {
        return
    }


    var csrftoken = Cookies.get('csrftoken');
    axios({
      withCredentials: true,
      method: 'post',
      url: protocol+'://'+IP+'/api/token/refresh/',
      data: {'refresh': localStorage.getItem('refresh_token')},
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken}} ) 
    .then(res =>{
      localStorage.setItem('access_token', res.data["access"])
      localStorage.setItem('refresh_token', res.data["refresh"])
      axios({
        withCredentials: true,
        method: 'post',
        url: protocol+'://'+IP+'/api/upload_image',
        data: data,
        headers: {
          'Authorization': "JWT " + localStorage.getItem('access_token'),
          'Content-Type': 'application/json',
          'content-type': 'multipart/form-data',
          'X-CSRFToken': csrftoken}} )
      .then(res => {
        setshowUploadProgress(true)
        setRefresh((prevValue) => prevValue + 1) 
      })
    })
    .catch(err => {
      console.log(err.response.data);
      navigate("/login")
    })

  };

  const fileUpload = (file)  => {
    let data = {}

    if (file) {
        data = {'run_id': props.run_id, 'file': file}
    } 
    else {
        return
    }

    var csrftoken = Cookies.get('csrftoken');
    axios({
      withCredentials: true,
      method: 'post',
      url: protocol+'://'+IP+'/api/token/refresh/',
      data: {'refresh': localStorage.getItem('refresh_token')},
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken}} ) 
    .then(res =>{
      localStorage.setItem('access_token', res.data["access"])
      localStorage.setItem('refresh_token', res.data["refresh"])
      axios({
        withCredentials: true,
        method: 'post',
        url: protocol+'://'+IP+'/api/upload_file',
        data: data,
        headers: {
          'Authorization': "JWT " + localStorage.getItem('access_token'),
          'content-type': 'multipart/form-data',
          'X-CSRFToken': csrftoken}} )
      .then(res => { 
          setshowFileUploadProgress(true)
          setRefresh((prevValue) => prevValue + 1)
        })
    })
    .catch(err => {
      console.log(err.response.data);
      navigate("/login")
    })
  }


 const dummyRequest = () => {
    console.log('lol')
  };

  const viewNode = (id) => {
    setNodeViewModalDict(prevState => {
      return {
        ...prevState,
        [id]: true
      }
    });
    setRefresh((prevValue) => prevValue + 1) 
  };


  const closeNode = (id) => {
    console.log(id)
    setNodeViewModalDict(prevState => {
      return {
        ...prevState,
        [id]: false
      }
    });
    setRefresh((prevValue) => prevValue + 1) 
  };

  const editNode = (id) => {
    console.log(id)
    setEditNodeViewModalDict(prevState => {
      return {
        ...prevState,
        [id]: true
      }
    });
    setEditNodeID(id)
    setRefresh((prevValue) => prevValue + 1) 
  };

  const closeEditNode = (id) => {
    console.log(id)
    setEditNodeViewModalDict(prevState => {
      return {
        ...prevState,
        [id]: false
      }
    });
    setRefresh((prevValue) => prevValue + 1) 
    console.log(editNodeViewModalDict)
  }

  const addKeyValue = (id) => {
    console.log(id)
    setAddKeyValueDict(prevState => {
      return {
        ...prevState,
        [id]: true
      }
    });
    setRefresh((prevValue) => prevValue + 1) 
  }

  const closeAddKeyValue = (id) => {
    console.log(id)
    setAddKeyValueDict(prevState => {
      return {
        ...prevState,
        [id]: false
      }
    });
    setRefresh((prevValue) => prevValue + 1) 
  }


  const DeleteNode = (id) => {
    closeNode(id)
    closeEditNode(id)
    setIsDeleteNodeModalOpen(true)
    setEditNodeID(id)
    setRefresh((prevValue) => prevValue + 1) 
  };


  const handleDeleteNodeOk = () => {
      var csrftoken = Cookies.get('csrftoken');
      axios({
        withCredentials: true,
        method: 'post',
        url: protocol+'://'+IP+'/api/token/refresh/',
        data: {'refresh': localStorage.getItem('refresh_token')},
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken}} ) 
      .then(res =>{
          localStorage.setItem('access_token', res.data["access"])
          localStorage.setItem('refresh_token', res.data["refresh"])

          axios({
          withCredentials: true,
          method: 'post',
          url: protocol+'://'+IP+'/api/node_delete',
          data: {'node_id': editNodeID},
          headers: {
            'Authorization': "JWT " + localStorage.getItem('access_token'),
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken}} )
        .then(res => {
           if(res.data == 'OK')
              setIsDeleteNodeModalOpen(false)
              setRefresh((prevValue) => prevValue + 1) 
        })
        .catch(err => {
          console.log(err.response.data);
        })
      })
  };



  useEffect(() => {
    var csrftoken = Cookies.get('csrftoken');
    axios({
      withCredentials: true,
      method: 'post',
      url: protocol+'://'+IP+'/api/token/refresh/',
      data: {'refresh': localStorage.getItem('refresh_token')},
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken}} ) 
    .then(res =>{
      localStorage.setItem('access_token', res.data["access"])
      localStorage.setItem('refresh_token', res.data["refresh"])
      axios({
        withCredentials: true,
        method: 'post',
        url: protocol+'://'+IP+'/api/get_nodes',
        data: {'run_id': props.run_id},
        headers: {
          'Authorization': "JWT " + localStorage.getItem('access_token'),
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken}} )
      .then(res => {  
          let variable_nodes = []
          let csv_nodes = []
          let dataset_nodes = []
          let result_nodes = []
          let method_nodes = []
          let objective_nodes = []
          let system_info_list = []
          let library_list = []

          let node_view_dict = {}
          let edit_node_view_dict = {}


          if (res.data['installed_packages']){
              let libraries = JSON.parse(res.data['installed_packages'].replace(/'/g, '"'))
              for(let i = 0; i<libraries.length;i++){
                library_list.push( 
                       {key: i,
                        label: (
                            <div>{libraries[i]}</div>
                        ),
                      })
                }

              setLibraries(<Menu items={library_list} style={{overflowY: 'auto', height:'300px'}}/>)
          }

          

          if (res.data['system_info']){
            let systeminfo = JSON.parse(res.data['system_info'].replace(/'/g, '"'))
            for(let i = 0; i<systeminfo.length;i++){
              {systeminfo[i].includes('  GPU  ') || systeminfo[i].includes('  CPU  ') || systeminfo[i].includes('  MEMORY  ')
              ?
              system_info_list.push( 
                     {key: i,
                      label: (
                          <div style={{color: 'white', fontSize:'15px'}}>{systeminfo[i]}</div>
                      ),
                      style:{backgroundColor: 'blue'}
                    })
              :
              system_info_list.push( 
                   {key: i,
                    label: (
                        <div>{systeminfo[i]}</div>
                    ),
                  })           
              }
            }

            setSystemInfo(<Menu items={system_info_list} style={{overflowY: 'auto', height:'300px'}}/>)           
          }


          if (res.data['files_list']){
            let files_list = []
            for(var i=0;i<res.data['files_list'].length;i++){
              files_list.push(         
                  {key: i,
                  label: (
                      <div><a href={res.data['files_list'][i]}>{res.data['files_list'][i].split("/").slice(-1)}</a></div>
                  ),
                })
            }
            setFiles(<Menu items={files_list} style={{overflowY: 'auto', height:'300px'}}/>)
          }

          if (res.data['images_list']){
            let images_list = []
            for(var i=0;i<res.data['images_list'].length;i++){
              images_list.push(         
                  {key: i,
                  label: (
                      <div><img width={500} src={res.data['images_list'][i]} /></div>
                  ),
                })
            }
            setImages(<Menu items={images_list} style={{overflowY: 'auto', height:'600px'}}/>)
          }
          
          

          if (res.data['nodes']){
            for(var i=0;i<res.data['nodes'].length;i++){
              let index = res.data['nodes'][i]['id']
              let rows = []
              let rows_keyval = []
              let cmatrix = ""
              let count = 0
              let color = 'white'

              if(res.data['nodes'][i]['node_type'] == 0  && res.data['nodes'][i]['csv_node'] == 0 && res.data['nodes'][i]['dataset_node'] == 0){
                for(const [key, value] of Object.entries(res.data['nodes'][i]['description'])){
                  count+=1
                  if(count%2==0)
                    color = '#E0E0E0'
                  else
                    color = '#AECBB7'
                  rows.push(<div style={{fontSize:'16px', width:'100%', backgroundColor: color, display:'flex', flexDirection:'row', whiteSpace: 'pre-wrap', wordBreak: 'break-all'}}><div style={{paddingLeft: '90px', width: '460px'}}>{String(key)}</div><div style={{width: '180px'}}>{JSON.stringify(value)}</div></div>)
                }
                  rows_keyval.push(
                          <Form
                            initialValues={{ remember: true,}}
                            {...layout}
                            onFinish={onFinishKeyValue}
                            style={{fontFamily: 'Helvetica, Arial, sans-serif', marginTop:'12px'}}>
                              <Form.Item name={'node_id'} initialValue={res.data['nodes'][i]['id']} hidden={true}></Form.Item>

                              <div style={{display:'flex', justifyContent:'center'}}>                                
                                <Form.Item name={"key"}> 
                                  <Input placeholder="Key" style={{width:'165px', marginRight:'200px', marginLeft:'50px'}}/> 
                                </Form.Item> 

                                
                                <Form.Item name={"value"}> 
                                  <Input placeholder="Value" style={{width:'165px'}} /> 
                                </Form.Item> 
                              </div>

                              <div style={{display:'flex', justifyContent:'center'}}>
                              <Form.Item>
                                <Button htmlType="submit" style={{color:'blue'}} shape="circle" onClick={()=>closeAddKeyValue(index)} > < CheckOutlined /> </Button>
                              </Form.Item>
                              </div>

                            </Form> )   
              }
              else if (res.data['nodes'][i]['node_type'] == 0 && res.data['nodes'][i]['csv_node'] == 1){
                if (res.data['nodes'][i]['description']){
                  let parsed_columns = JSON.parse(res.data['nodes'][i]['description']['columns list'].replace(/'/g, '"'))
                  let parsed_null = JSON.parse(res.data['nodes'][i]['description']['isnull list'].replace(/'/g, '"'))
                  let parsed_dtypes = JSON.parse(res.data['nodes'][i]['description']['dtypes list'].replace(/'/g, '"'))
                  let parsed_unique = JSON.parse(res.data['nodes'][i]['description']['isunique list'].replace(/'/g, '"'))
                  let size = res.data['nodes'][i]['description']['size']
                  let shape = res.data['nodes'][i]['description']['shape']

                  rows.push(<div> Size (in KB): {size}</div>)
                  rows.push(<div> Shape: {shape}</div>)

                  rows.push(<div style={{fontSize:'18px', color:'white', marginTop: '10px', width:'100%', backgroundColor: '#38b6ff', display:'flex', flexDirection:'row', paddingBottom:'10px', paddingTop:'10px'}}><div style={{paddingLeft: '20px', width:'225px'}}>Column</div><div style={{width:'134px'}}>Unique</div><div style={{width:'130px'}}>Null</div><div style={{width:'134px'}}>Datatype</div></div>)

                  for(let i=0; i<parsed_columns.length; i++){
                    count+=1
                    if(count%2==0)
                      color = '#E0E0E0'
                    else
                      color ='#89CFF0'
                    rows.push(<div style={{fontSize:'16px', width:'100%', backgroundColor: color, display:'flex', flexDirection:'row'}}><div style={{paddingLeft: '20px', width:'234px'}}>{parsed_columns[i]}</div><div style={{width:'134px'}}>{parsed_unique[i]}</div><div style={{width:'134px'}}>{parsed_null[i]}</div><div style={{width:'134px'}}>{parsed_dtypes[i]}</div></div>)
                   
                   }
                  }
              }
              else if (res.data['nodes'][i]['node_type'] == 0 && res.data['nodes'][i]['dataset_node'] == 1){
                if (res.data['nodes'][i]['description']){              
                  for(const [key, value] of Object.entries(res.data['nodes'][i]['description'])){
                    count+=1
                    if(count%2==0)
                      color = '#E0E0E0'
                    else
                      color = '#F08080'
                    rows.push(<div style={{fontSize:'16px', width:'100%', backgroundColor: color, display:'flex', flexDirection:'row', whiteSpace: 'pre-wrap', wordBreak: 'break-all'}}><div style={{paddingLeft: '90px', width: '460px'}}>{String(key)}</div><div style={{width: '180px'}}>{JSON.stringify(value)}</div></div>)
                  }          
                  rows_keyval.push(
                          <Form
                            initialValues={{ remember: true,}}
                            {...layout}
                            onFinish={onFinishKeyValue}
                            style={{fontFamily: 'Helvetica, Arial, sans-serif', marginTop:'12px'}}>
                              <Form.Item name={'node_id'} initialValue={res.data['nodes'][i]['id']} hidden={true}></Form.Item>

                              <div style={{display:'flex', justifyContent:'center'}}>                                
                                <Form.Item name={"key"}> 
                                  <Input placeholder="Key" style={{width:'165px', marginRight:'200px', marginLeft:'50px'}}/> 
                                </Form.Item> 

                                
                                <Form.Item name={"value"}> 
                                  <Input placeholder="Value" style={{width:'165px'}} /> 
                                </Form.Item> 
                              </div>

                              <div style={{display:'flex', justifyContent:'center'}}>
                              <Form.Item>
                                <Button htmlType="submit" style={{color:'blue'}} shape="circle" onClick={()=>closeAddKeyValue(index)} > < CheckOutlined /> </Button>
                              </Form.Item>
                              </div>

                            </Form> ) 
                }
              }
              else if (res.data['nodes'][i]['node_type'] == 2){

                if (res.data['nodes'][i]['description']){
                  try{
                    let c_matrix = res.data['nodes'][i]['description']['c_matrix']

                    if (typeof c_matrix == 'undefined')
                      cmatrix=undefined
                    else{
                      console.log(c_matrix)
                      cmatrix=(
                          <div>
                          Confusion Matrix
                          <table border="1">
                            <tr>
                              <td style={{padding:20}}>TP: {c_matrix[3]}</td>
                              <td style={{padding:20}}>FP: {c_matrix[1]}</td>
                            </tr>
                            <tr>
                              <td style={{padding:20}}>FN: {c_matrix[2]}</td>
                              <td style={{padding:20}}>TN: {c_matrix[0]}</td>
                            </tr>
                          </table>
                          </div>
                      )
                    }
                  }
                  catch(err){
                    console.log(err)
                  }

 
                  try {
                    let freq = res.data['nodes'][i]['description']['freq']
                    let bins = res.data['nodes'][i]['description']['bins']
                    let fpr = res.data['nodes'][i]['description']['fpr']
                    let tpr = res.data['nodes'][i]['description']['tpr']
                    setFreq(freq)
                    setBins(bins)
                    setFpr(fpr)
                    setTpr(tpr)
                  }
                  catch(err){
                    console.log(err)
                  }

                  for(const [key, value] of Object.entries(res.data['nodes'][i]['description'])){
                    if (key == 'freq' || key == 'bins' || key == 'fpr' || key == 'tpr' || key == 'c_matrix')
                      continue

                    count+=1
                    if(count%2==0)
                      color = 'white'
                    else
                      color = '#E8E8E8'
                    rows.push(<div style={{fontSize:'16px', width:'100%', backgroundColor: color, display:'flex', flexDirection:'row', whiteSpace: 'pre-wrap', wordBreak: 'break-all'}}><div style={{paddingLeft: '90px', width: '460px'}}>{String(key)}</div><div style={{width: '180px'}}>{JSON.stringify(value)}</div></div>)
                  }
                  rows_keyval.push(
                          <Form
                            initialValues={{ remember: true,}}
                            {...layout}
                            onFinish={onFinishKeyValue}
                            style={{fontFamily: 'Helvetica, Arial, sans-serif', marginTop:'12px'}}>
                              <Form.Item name={'node_id'} initialValue={res.data['nodes'][i]['id']} hidden={true}></Form.Item>

                              <div style={{display:'flex', justifyContent:'center'}}>                                
                                <Form.Item name={"key"}> 
                                  <Input placeholder="Key" style={{width:'165px', marginRight:'200px', marginLeft:'50px'}}/> 
                                </Form.Item> 

                                
                                <Form.Item name={"value"}> 
                                  <Input placeholder="Value" style={{width:'165px'}} /> 
                                </Form.Item> 
                              </div>

                              <div style={{display:'flex', justifyContent:'center'}}>
                              <Form.Item>
                                <Button htmlType="submit" style={{color:'blue'}} shape="circle" onClick={()=>closeAddKeyValue(index)} > < CheckOutlined /> </Button>
                              </Form.Item>
                              </div>

                            </Form> )    
                }
              }


              if (res.data['nodes'][i]['node_type'] == 0){
                if (res.data['nodes'][i]['dataset_node'] == 1){

                    dataset_nodes.push( //Modal is in div. Therefore check if false before opening
                      <div>
                        <div style={{color:'black', width: '650px', minHeight: '100px', border: '1px solid black', display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', margin:'20px', borderRadius: '5px', boxShadow: '3px 4px 5px #888888'}}>
                            < EditOutlined onClick={() => viewNode(index)}  style={{paddingTop:'5px', cursor:'pointer', marginLeft:'auto', marginRight:'10px'}} />
                            <div style={{paddingBottom: '10px', paddingTop: '10px', fontWeight: 'bold'}}>
                              {res.data['nodes'][i]['node_summary']}
                            </div>

                            <div style={{display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', marginBottom:'15px'}}>
                              {rows}
                              {rows_keyval}
                            </div>
                        </div>

                        <Modal visible={nodeViewModalDict[res.data['nodes'][i]['id']]} closable={false} footer={null}>

                          {editNodeViewModalDict[res.data['nodes'][i]['id']] == true ?

                          <Form
                            initialValues={{ remember: true,}}
                            {...layout}
                            onFinish={onFinish}
                            style={{fontFamily: 'Helvetica, Arial, sans-serif'}}>
                              <Form.Item name={'node_id'} initialValue={res.data['nodes'][i]['id']} hidden={true}></Form.Item>

                              Name
                              <Form.Item name={"node_name"} initialValue={res.data['nodes'][i]['name']}> 
                                <Input placeholder="Node Name" style={{width:'165px'}} defaultValue={res.data['nodes'][i]['name']} /> 
                              </Form.Item> 

                              Description
                              <Form.Item name={"node_summary"} initialValue={JSON.stringify(res.data['nodes'][i]['node_summary']).slice(1, -1)}>
                                <TextArea rows={2} showCount placeholder="Summary" style={{width:'450px'}} defaultValue={JSON.stringify(res.data['nodes'][i]['node_summary']).slice(1, -1)} />
                              </Form.Item> 

                              Dictionary of values
                              <Form.Item name={"node_description"} initialValue={JSON.stringify(res.data['nodes'][i]['description'])}>
                                <TextArea rows={8} showCount placeholder="Description" style={{width:'450px'}} defaultValue={JSON.stringify(res.data['nodes'][i]['description'])} />
                              </Form.Item> 

                              <Form.Item>
                                <Button style={{marginRight:10, color:'blue'}}  shape="circle" onClick={()=>closeEditNode(index)}> < CloseOutlined /> </Button> 
                                    <Button htmlType="submit" style={{marginRight:10, color:'blue'}} shape="circle" onClick={()=>closeEditNode(index)} > < CheckOutlined /> </Button>
                              </Form.Item>
                              <div style={{color:'red', marginBottom:'15px'}}><u style={{cursor:'pointer'}} onClick={()=>DeleteNode(index)}>Delete Node</u></div>

                            </Form>
                            :
                            <div>
                            <span style={{color:'blue'}}>Created {res.data['nodes'][i]['date'].slice(0, 10)}</span>
                            <div style={{fontSize:'20px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom:'15px'}}>
                              {res.data['nodes'][i]['name']}
                            </div>

                            <div>
                              {res.data['nodes'][i]['node_summary']}
                            </div>

                            <div style={{border: '1px solid black'}}>
                              {rows}
                            </div>
                            <div style={{marginTop: '15px'}}>
                              <Button style={{marginRight:10, color:'blue'}}  shape="circle" onClick={()=>closeNode(index)}> < CloseOutlined /> </Button>  <Button onClick={() => editNode(index)} style={{marginRight:10, color:'blue'}}  shape="circle"> < EditOutlined /> </Button>
                            </div>
                            </div>
                          }

                        </Modal>
                      </div>
                  )

                }

              else if(res.data['nodes'][i]['csv_node'] == 1){

                    csv_nodes.push(
                      <div>
                        <div style={{ width: '650px', minHeight: '100px', border: '1px solid black', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin:'20px', borderRadius: '5px', boxShadow: '3px 4px 5px #888888'}}>
                            <div onClick={() => viewNode(index)} style={{cursor:'pointer', marginTop:'15px', display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', marginBottom:'15px'}}>
                              Add a CSV file from your code.
                              {rows}
                            </div>

                            <Modal visible={nodeViewModalDict[res.data['nodes'][i]['id']]} closable={false} footer={null}>
                            <div style={{color:'red', marginBottom:'15px'}}><u style={{cursor:'pointer'}} onClick={()=>DeleteNode(index)}>Delete Node</u></div>
                            <Button htmlType="submit" style={{marginRight:10, color:'blue'}} shape="circle" onClick={()=>closeNode(index)} > < CloseOutlined /> </Button> 
                            </Modal>
                        </div>
                      </div>
                  )
              }

              else if(res.data['nodes'][i]['csv_node'] == 0 && res.data['nodes'][i]['dataset_node'] == 0){

                    variable_nodes.push(
                      <div>
                        <div style={{width: '650px', minHeight: '100px', border: '1px solid black', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin:'20px', borderRadius: '5px', boxShadow: '3px 4px 5px #888888'}}>
                            < EditOutlined onClick={() => viewNode(index)}  style={{paddingTop:'5px', cursor:'pointer', marginLeft:'auto', marginRight:'10px'}} />
                            <div style={{paddingBottom: '10px', paddingTop: '10px', fontWeight: 'bold'}}>
                              {res.data['nodes'][i]['node_summary']}
                            </div>

                            <div style={{display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', marginBottom:'15px'}}>
                              {rows}
                              {rows_keyval}
                            </div>
                        </div>

                        <Modal visible={nodeViewModalDict[res.data['nodes'][i]['id']]} closable={false} footer={null}>

                          {editNodeViewModalDict[res.data['nodes'][i]['id']] == true ?

                          <Form
                            initialValues={{ remember: true,}}
                            {...layout}
                            onFinish={onFinish}
                            style={{fontFamily: 'Helvetica, Arial, sans-serif'}}>
                              <Form.Item name={'node_id'} initialValue={res.data['nodes'][i]['id']} hidden={true}></Form.Item>

                              Name
                              <Form.Item name={"node_name"} initialValue={res.data['nodes'][i]['name']}> 
                                <Input placeholder="Node Name" style={{width:'165px'}} defaultValue={res.data['nodes'][i]['name']} /> 
                              </Form.Item> 

                              Description
                              <Form.Item name={"node_summary"} initialValue={JSON.stringify(res.data['nodes'][i]['node_summary']).slice(1, -1)}>
                                <TextArea rows={2} showCount placeholder="Summary" style={{width:'450px'}} defaultValue={JSON.stringify(res.data['nodes'][i]['node_summary']).slice(1, -1)} />
                              </Form.Item> 


                              Dictionary of values
                              <Form.Item name={"node_description"} initialValue={JSON.stringify(res.data['nodes'][i]['description'])}>
                                <TextArea rows={8} showCount placeholder="Description" style={{width:'450px'}} defaultValue={JSON.stringify(res.data['nodes'][i]['description'])} />
                              </Form.Item> 

                              <Form.Item>
                                <Button style={{marginRight:10, color:'blue'}}  shape="circle" onClick={()=>closeEditNode(index)}> < CloseOutlined /> </Button> 
                                    <Button htmlType="submit" style={{marginRight:10, color:'blue'}} shape="circle" onClick={()=>closeEditNode(index)} > < CheckOutlined /> </Button>
                              </Form.Item>
                              <div style={{color:'red', marginBottom:'15px'}}><u style={{cursor:'pointer'}} onClick={()=>DeleteNode(index)}>Delete Node</u></div>

                            </Form>
                            :
                            <div>
                            <span style={{color:'blue'}}>Created {res.data['nodes'][i]['date'].slice(0, 10)}</span>
                            <div style={{fontSize:'20px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom:'15px'}}>
                              {res.data['nodes'][i]['name']}
                            </div>

                            <div>
                              {res.data['nodes'][i]['node_summary']}
                            </div>

                            <div style={{border: '1px solid black'}}>
                              {rows}
                            </div>
                            <div style={{marginTop: '15px'}}>
                              <Button style={{marginRight:10, color:'blue'}}  shape="circle" onClick={()=>closeNode(index)}> < CloseOutlined /> </Button>  <Button onClick={() => editNode(index)} style={{marginRight:10, color:'blue'}}  shape="circle"> < EditOutlined /> </Button>
                            </div>
                            </div>
                          }

                        </Modal>
                      </div>
                  )

              }


 
            }
            else if(res.data['nodes'][i]['node_type'] == 1){


               method_nodes.push(
                  <div style={{padding:'10px', fontWeight: 'bold', color:'white', fontSize:'15px', width: '650px', minHeight: '70px', border: '1px solid black', margin:'20px', backgroundColor: '#34568B', borderRadius: '5px', boxShadow: '3px 4px 5px #888888'}}>
                    
                    {editNodeViewModalDict[res.data['nodes'][i]['id']] == true ?

                    <Form
                      initialValues={{ remember: true,}}
                      {...layout}
                      onFinish={onFinish}
                      style={{fontFamily: 'Helvetica, Arial, sans-serif'}}>
                        <Form.Item name={'node_id'} initialValue={res.data['nodes'][i]['id']} hidden={true}></Form.Item>

                        <Form.Item name={"node_description"} initialValue={res.data['nodes'][i]['description']}>
                          <TextArea rows={5} placeholder="Description" style={{minWidth:'600px'}} defaultValue={res.data['nodes'][i]['description']} />
                        </Form.Item> 

                        <Form.Item>
                          <Button style={{marginRight:10, color:'blue'}}  shape="circle" onClick={()=>closeEditNode(index)}> < CloseOutlined /> </Button> 
                          <Button htmlType="submit" style={{marginRight:10, color:'blue'}} shape="circle" onClick={()=>closeEditNode(index)} > < CheckOutlined /> </Button>
                        </Form.Item>
                        <div style={{color:'red', marginBottom:'15px'}}><u style={{cursor:'pointer'}} onClick={()=>DeleteNode(index)}>Delete Node </u></div>

                      </Form>
                      :
                      <div onClick={() => editNode(index)} style={{paddingLeft:'50px', paddingRight:'50px', paddingTop:'12px', paddingBottom:'12px', cursor:'pointer', whiteSpace: 'pre-wrap', wordBreak: 'break-all'}}>{res.data['nodes'][i]['description']}</div>
                    }

                  </div>

              )               
            }
            else if(res.data['nodes'][i]['node_type'] == 5){


               objective_nodes.push(
               <div style={{padding:'10px', fontWeight: 'bold', color:'white', fontSize:'15px', width: '650px', minHeight: '70px', border: '1px solid black', margin:'20px', backgroundColor: '#34568B', borderRadius: '5px', boxShadow: '3px 4px 5px #888888'}}>
                    
                    {editNodeViewModalDict[res.data['nodes'][i]['id']] == true ?

                    <Form
                      initialValues={{ remember: true,}}
                      {...layout}
                      onFinish={onFinish}
                      style={{fontFamily: 'Helvetica, Arial, sans-serif'}}>
                        <Form.Item name={'node_id'} initialValue={res.data['nodes'][i]['id']} hidden={true}></Form.Item>

                        <Form.Item name={"node_description"} initialValue={res.data['nodes'][i]['description']}>
                          <TextArea rows={5} placeholder="Description" style={{minWidth:'600px'}} defaultValue={res.data['nodes'][i]['description']} />
                        </Form.Item> 

                        <Form.Item>
                          <Button style={{marginRight:10, color:'blue'}}  shape="circle" onClick={()=>closeEditNode(index)}> < CloseOutlined /> </Button> 
                          <Button htmlType="submit" style={{marginRight:10, color:'blue'}} shape="circle" onClick={()=>closeEditNode(index)} > < CheckOutlined /> </Button>
                        </Form.Item>
                        <div style={{color:'red', marginBottom:'15px'}}><u style={{cursor:'pointer'}} onClick={()=>DeleteNode(index)}>Delete Node </u></div>

                      </Form>
                      :
                      <div onClick={() => editNode(index)} style={{paddingLeft:'50px', paddingRight:'50px', paddingTop:'12px', paddingBottom:'12px', cursor:'pointer', whiteSpace: 'pre-wrap', wordBreak: 'break-all'}}>{res.data['nodes'][i]['description']}</div>
                    }

                </div>
              )               
            }
            else if(res.data['nodes'][i]['node_type'] == 2){

               result_nodes.push(
                <div>
                  <div style={{width: '650px', minHeight: '100px', border: '1px solid black', display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', margin:'20px', backgroundColor:'white', borderRadius: '5px', boxShadow: '3px 4px 5px #888888'}}>
                      < EditOutlined onClick={() => viewNode(index)}  style={{paddingTop:'5px', cursor:'pointer', marginLeft:'auto', marginRight:'10px'}} />
                      <div style={{display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', marginBottom:'15px', marginTop:'15px'}}>
                      
                      <div style={{paddingBottom: '10px', paddingTop: '10px', fontWeight: 'bold'}}>
                        {res.data['nodes'][i]['node_summary']}
                      </div>


                      <div>
                        {rows}
                        {rows_keyval}
                      </div>  

                      { res.data['nodes'][i]['result_type'] == 1 ?
                      <Bar
                        data={{
                          labels: bins,
                          datasets: [
                            {
                              label: 'Prediction Histogram',
                              lineTension: 0,
                              fill: false,
                              borderJoinStyle: "round",
                              data: freq,
                              borderWidth: 0.2,
                              barPercentage: 1,
                              categoryPercentage: 1,
                              hoverBackgroundColor: "darkgray",
                              barThickness: "flex",
                              borderColor: 'rgb(53, 162, 235)',
                              backgroundColor: 'rgba(53, 162, 235, 0.5)',
                              fontSize:'15px'
                            }
                          ]
                        }}
                        options={bar_options}
                      />
                      :
                      null}

                      { res.data['nodes'][i]['result_type'] == 1 ?
                      <Line
                        data={{
                          labels: fpr,
                          datasets: [
                            {
                              label: 'ROC Curve',
                              data: tpr,
                              borderWidth: 2,
                              borderColor: 'rgb(255, 99, 132)',
                              backgroundColor: 'rgba(255, 99, 132, 0.5)',                             
                            }
                          ]
                        }}
                        options={line_options}
                      />
                      :
                      null}

                      {typeof cmatrix != 'undefined' ?
                      <div style={{marginTop:'20px', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                        {cmatrix}
                      </div>
                      :
                      null}

                      </div>

                  </div>

                  <Modal visible={nodeViewModalDict[res.data['nodes'][i]['id']]} closable={false} footer={null}>

                    {editNodeViewModalDict[res.data['nodes'][i]['id']] == true ?

                    <Form
                      initialValues={{ remember: true,}}
                      {...layout}
                      onFinish={onFinish}
                      style={{fontFamily: 'Helvetica, Arial, sans-serif'}}>
                        <Form.Item name={'node_id'} initialValue={res.data['nodes'][i]['id']} hidden={true}></Form.Item>

                        Name
                        <Form.Item name={"node_name"} initialValue={res.data['nodes'][i]['name']}> 
                          <Input placeholder="Node Name" style={{width:'165px'}} defaultValue={res.data['nodes'][i]['name']} /> 
                        </Form.Item> 

                        Description
                        <Form.Item name={"node_summary"} initialValue={JSON.stringify(res.data['nodes'][i]['node_summary']).slice(1, -1)}>
                          <TextArea rows={2} showCount placeholder="Summary" style={{width:'450px'}} defaultValue={JSON.stringify(res.data['nodes'][i]['node_summary']).slice(1, -1)} />
                        </Form.Item> 

                        Dictionary of values
                        <Form.Item name={"node_description"} initialValue={JSON.stringify(res.data['nodes'][i]['description'])}>
                          <TextArea rows={8} showCount placeholder="Description" style={{width:'450px'}} defaultValue={JSON.stringify(res.data['nodes'][i]['description'])} />
                        </Form.Item> 

                        <Form.Item>
                          <Button style={{marginRight:10, color:'blue'}}  shape="circle" onClick={()=>closeEditNode(index)}> < CloseOutlined /> </Button> 
                          <Button htmlType="submit" style={{marginRight:10, color:'blue'}} shape="circle" onClick={()=>closeEditNode(index)} > < CheckOutlined /> </Button>
                        </Form.Item>
                        <div style={{color:'red', marginBottom:'15px'}}><u style={{cursor:'pointer'}} onClick={()=>DeleteNode(index)}>Delete Node</u></div>

                      </Form>
                      : 
                      <div>
                      <span style={{color:'blue'}}>Created {res.data['nodes'][i]['date'].slice(0, 10)}</span>            
                      
                      <div style={{fontSize:'20px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom:'15px'}}>
                        {res.data['nodes'][i]['name']}
                      </div>

                      <div>
                        {res.data['nodes'][i]['node_summary']}
                      </div>

                      <div style={{border: '1px solid black'}}>
                        {rows}
                      </div> 

                      <div style={{fontSize:'15px', display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', marginBottom:'15px'}}>

                      { res.data['nodes'][i]['result_type'] == 1 ?                     
                      <Bar
                        data={{
                          labels: bins,
                          datasets: [
                            {
                              label: 'Prediction Histogram',
                              lineTension: 0,
                              fill: false,
                              borderJoinStyle: "round",
                              data: freq,
                              borderWidth: 0.2,
                              barPercentage: 1,
                              categoryPercentage: 1,
                              hoverBackgroundColor: "darkgray",
                              barThickness: "flex",
                              borderColor: 'rgb(53, 162, 235)',
                              backgroundColor: 'rgba(53, 162, 235, 0.5)',
                            }
                          ]
                        }}
                        options={bar_options}
                      />:null}


                      { res.data['nodes'][i]['result_type'] == 1 ? 
                      <Line
                        data={{
                          labels: fpr,
                          datasets: [
                            {
                              label: 'ROC Curve',
                              data: tpr,
                              borderWidth: 2,
                              borderColor: 'rgb(255, 99, 132)',
                              backgroundColor: 'rgba(255, 99, 132, 0.5)',
                            }
                          ]
                        }}
                        options={line_options}
                      />:null}

                      {typeof cmatrix != 'undefined' ?
                      <div style={{marginTop:'20px', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                        {cmatrix}
                      </div>
                      :
                      null}


                      <div style={{marginTop: '15px'}}>
                        <Button style={{marginRight:10, color:'blue'}}  shape="circle" onClick={()=>closeNode(index)}> < CloseOutlined /> </Button>  <Button onClick={() => editNode(index)} style={{marginRight:10, color:'blue'}}  shape="circle"> < EditOutlined /> </Button>
                      </div>
                      </div>
                      </div>}

                  </Modal>
                </div>

              )               
            }
            else{
              //do nothing
            }

          }

          setCSVNodes(csv_nodes)
          setMethodNodes(method_nodes)
          setResultNodes(result_nodes)
          setDatasetNodes(dataset_nodes)
          setVariableNodes(variable_nodes)
          setObjectiveNodes(objective_nodes)

        }})
    })
    .catch(err => {
      console.log(err.response.data); //style={{display:'flex', flexDirection:'column', justifyContent:'center'}}
      navigate("/login")
    })
  }, [props, refresh]);


  const onNodeCreate = (nodeType)  => {

    var csrftoken = Cookies.get('csrftoken');
    axios({
      withCredentials: true,
      method: 'post',
      url: protocol+'://'+IP+'/api/token/refresh/',
      data: {'refresh': localStorage.getItem('refresh_token')},
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken}} ) 
    .then(res =>{
      localStorage.setItem('access_token', res.data["access"])
      localStorage.setItem('refresh_token', res.data["refresh"])
      axios({
        withCredentials: true,
        method: 'post',
        url: protocol+'://'+IP+'/api/create_node',
        data: {'run_id': props.run_id, 'node_type': nodeType},
        headers: {
          'Authorization': "JWT " + localStorage.getItem('access_token'),
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken}} )
      .then(res => { 
          setIsCreateNodeModalOpen(false)           
          setRefresh((prevValue) => prevValue + 1)
        })
    })
    .catch(err => {
      console.log("Error"); //style={{display:'flex', flexDirection:'column', justifyContent:'center'}}
      navigate("/login")
    })
  }





  return (
    <div>

    <Modal visible={isDeleteNodeModalOpen} closable={false}  footer={null}>
        <div style={{color:'red', marginBottom:'15px'}}><u>Are you sure you want to delete this Node? Deleted Nodes cannot be restored.</u></div>
        <Button onClick={()=>setIsDeleteNodeModalOpen(false)}>Cancel</Button> <Button type="primary" style={{backgroundColor:'red'}} onClick={handleDeleteNodeOk}>Delete</Button>
    </Modal>


      { props.run_id != -1 ? 

        <div style={{display:'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center'}}>
          <div style={{marginBottom:'15px', color:'#003568', fontSize:'17px', fontWeight:'bold', display:'flex', alignItems:'center'}}> 

            <Dragger action={imageUpload} customRequest={dummyRequest} showUploadList={false}>
              <span style={{marginRight:'20px', marginLeft:'20px'}}>Upload Images</span>
              { showUploadProgress == true ?
              <div style={{color:'green'}}>Success</div>:
              null}
            </Dragger>

           <Dropdown overlay={images} trigger={['click']}>
            <Tooltip placement="top" title="Libraries">
              <Button size="medium" shape="circle" style={{marginLeft:'5px', marginRight:'5px'}}> <FileImageOutlined /> </Button>
            </Tooltip> 
          </Dropdown>

          <Dragger action={fileUpload} customRequest={dummyRequest} showUploadList={false}>
            <span style={{marginRight:'20px', marginLeft:'20px'}}>Upload Files</span>
            { showFileUploadProgress == true ?
            <div style={{color:'green'}}>Success</div>:
            null}
          </Dragger>

          <Dropdown overlay={files} trigger={['click']}>
            <Tooltip placement="top" title="Files">
              <Button size="medium" shape="circle" style={{marginLeft:'5px', marginRight:'5px'}}> <FileOutlined /> </Button>
            </Tooltip> 
          </Dropdown>

          <Dropdown overlay={systemInfo}>
            <Tooltip placement="top" title="System">
              <Button size="medium" shape="circle" style={{marginRight:'5px'}}> <DesktopOutlined /> </Button> 
            </Tooltip>
          </Dropdown>

          <Dropdown overlay={libraries}>
            <Tooltip placement="top" title="Images">
              <Button size="medium" shape="circle" style={{marginRight:'5px'}}> <ApartmentOutlined /> </Button>
            </Tooltip> 
          </Dropdown>

          Run ID: {props.run_id}</div> 
 

          <div style={{color:'#34568B', fontSize:'20px', fontWeight:'bold'}}>Objective</div>
          <div style={{display:'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', flexWrap:'wrap'}}>
            {objectiveNodes}
            <PlusCircleOutlined style={{fontSize:'30px', paddingBottom:'30px'}} onClick={()=>onNodeCreate(5)} />
          </div>

          <Divider style={{fontSize:'20px'}} />

          <div style={{color:'#34568B', fontSize:'20px', fontWeight:'bold'}}>Dataset</div>
          <div style={{display:'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', flexWrap:'wrap'}}>
            {datasetNodes}
            <PlusCircleOutlined style={{fontSize:'30px', paddingBottom:'30px'}} onClick={()=>onNodeCreate(0)} />
          </div>

          <Divider />

          <div style={{color:'#34568B', fontSize:'20px', fontWeight:'bold'}}>Variables</div>
          <div style={{display:'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', flexWrap:'wrap'}}>
            {variableNodes}
            <PlusCircleOutlined style={{fontSize:'30px', paddingBottom:'30px'}} onClick={()=>onNodeCreate(1)} />
          </div>

          <Divider />

          <div style={{color:'#34568B', fontSize:'20px', fontWeight:'bold'}}>CSV</div>
          <div style={{display:'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', flexWrap:'wrap'}}>
            {csvNodes}
          </div>

          <Divider />

          <div style={{color:'#34568B', fontSize:'20px', fontWeight:'bold'}}>Methodology</div>
          <div style={{display:'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', flexWrap:'wrap'}}>
            {methodNodes}
            <PlusCircleOutlined style={{fontSize:'30px', paddingBottom:'30px'}} onClick={()=>onNodeCreate(2)} />
          </div>

          <Divider />

          <div style={{color:'#34568B', fontSize:'20px', fontWeight:'bold'}}>Results</div>
          <div style={{display:'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', flexWrap:'wrap'}}>
            {resultNodes}
            <PlusCircleOutlined style={{fontSize:'30px', paddingBottom:'30px'}} onClick={()=>onNodeCreate(3)} />
          </div>
        </div>
      :
        null}

    </div>
  );
};

export default CreateGraph;
