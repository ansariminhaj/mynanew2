import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import IP from "../components/ipConfig";
import { useNavigate, Link } from 'react-router-dom';
import { Button, Tooltip, Popover, Checkbox, Form, Input, Alert, Modal, Switch, Dropdown, Menu, Upload } from 'antd';
import { PlusCircleOutlined, EditOutlined, AlignLeftOutlined, ApartmentOutlined, ExpandOutlined, CloseOutlined, CheckOutlined, DesktopOutlined, CodeOutlined, NodeIndexOutlined, UploadOutlined } from '@ant-design/icons';
import '../components/index.css';
import protocol from "../components/httpORhttps";
import * as actions from '../store/actions/actions';
import { connect } from 'react-redux';
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart }            from 'react-chartjs-2'

const { TextArea } = Input;

const layout = {
  labelCol: {
    span: 2,
  },
  wrapperCol: {
    span: 18,
  },
};

const labels = [0.75, 1.25, 1.75, 2.25];
const data = [1, 2, 3, 4];
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
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [downloadWeights, setDownloadWeights] = useState();
  const [downloadNetwork, setDownloadNetwork] = useState();
  const [files, setFiles] = useState();

  const [variableNodes, setVariableNodes] = useState([])
  const [csvNodes, setCSVNodes] = useState([])
  const [datasetNodes, setDatasetNodes] = useState([])
  const [methodNodes, setMethodNodes] = useState([])
  const [resultNodes, setResultNodes] = useState([])
  const [nodeType, setNodeType] = useState(-1)
  const [nodeViewModalDict, setNodeViewModalDict] = useState({})
  const [editNodeViewModalDict, setEditNodeViewModalDict] = useState({})
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
    setNodeViewModalDict(prevState => {
      return {
        ...prevState,
        [id]: false
      }
    });
    setRefresh((prevValue) => prevValue + 1) 
  };

  const editNode = (id) => {
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
    setEditNodeViewModalDict(prevState => {
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

          if (res.data['weights']){
            setDownloadWeights(<div><a href={res.data['weights']}>{res.data['weights'].split("/").slice(-1)}</a></div>)
            setDownloadNetwork(<div><a href={res.data['network']}>{res.data['network'].split("/").slice(-1)}</a></div>)
          }

          if (res.data['files_list']){
            let files_list = []
            for(var i=0;i<res.data['files_list'].length;i++){
              files_list.push(<div><a href={res.data['files_list'][i]}>{res.data['files_list'][i].split("/").slice(-1)}</a></div>)
            }
            setFiles(files_list)
          }
          
          

          if (res.data['nodes']){
            for(var i=0;i<res.data['nodes'].length;i++){
              let index = res.data['nodes'][i]['id']
              let rows = []
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
                  rows.push(<div style={{width:'100%', backgroundColor: color, display:'flex', flexDirection:'row'}}><div style={{paddingLeft: '10px', width: '200px'}}>{String(key)}</div><div style={{width: '200px'}}>{JSON.stringify(value)}</div></div>)
                }    
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

                  rows.push(<div style={{fontSize:'17px', color:'white', marginTop: '10px', width:'100%', backgroundColor: '#38b6ff', display:'flex', flexDirection:'row', paddingBottom:'10px', paddingTop:'10px'}}><div style={{paddingLeft: '10px', width:'200px'}}>Column</div><div style={{width:'110px'}}>Unique</div><div style={{width:'110px'}}>Null</div><div style={{width:'110px'}}>Datatype</div></div>)

                  for(let i=0; i<parsed_columns.length; i++){
                    count+=1
                    if(count%2==0)
                      color = '#E0E0E0'
                    else
                      color ='#89CFF0'
                    rows.push(<div style={{width:'100%', backgroundColor: color, display:'flex', flexDirection:'row'}}><div style={{paddingLeft: '10px', width:'200px'}}>{parsed_columns[i]}</div><div style={{width:'110px'}}>{parsed_unique[i]}</div><div style={{width:'110px'}}>{parsed_null[i]}</div><div style={{width:'110px'}}>{parsed_dtypes[i]}</div></div>)
                   
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
                    rows.push(<div style={{width:'100%', backgroundColor: color, display:'flex', flexDirection:'row'}}><div style={{paddingLeft: '10px', width: '200px'}}>{String(key)}</div><div style={{width: '200px'}}>{JSON.stringify(value)}</div></div>)
                  }          
                }
              }
              else if (res.data['nodes'][i]['node_type'] == 2){

                if (res.data['nodes'][i]['description']){
                  try{
                    console.log(res.data['nodes'][i]['description']['c_matrix'])
                    let c_matrix = res.data['nodes'][i]['description']['c_matrix']

                    if (typeof c_matrix == 'undefined')
                      cmatrix=undefined
                    else{
                      console.log(c_matrix)
                      cmatrix=(
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
                      color = '#E8E8E8'
                    else
                      color = '#white'
                    rows.push(<div style={{width:'100%', backgroundColor: color, display:'flex', flexDirection:'row'}}><div style={{paddingLeft: '10px', width: '200px'}}>{String(key)}</div><div style={{width: '200px'}}>{JSON.stringify(value)}</div></div>)
                  }   

                }
              }


              if (res.data['nodes'][i]['node_type'] == 0){
                if (res.data['nodes'][i]['dataset_node'] == 1){

                    dataset_nodes.push( //Modal is in div. Therefore check if false before opening
                      <div>
                        <div onClick={() => viewNode(index)} style={{cursor:'pointer', fontWeight: 'bold', color:'black', fontSize:'15px', minWidth: '200px', minHeight: '100px', border: '2px solid red', display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', margin:'20px', borderRadius: '15px'}}>
                            <div style={{marginTop:'15px', fontSize:'15px', display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', marginBottom:'15px'}}>
                              {rows}
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

                              Parameter Dictionary (Please paste a dictionary here.)
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
                        <div onClick={() => viewNode(index)} style={{cursor:'pointer', fontWeight: 'bold', color:'black', fontSize:'15px', minWidth: '200px', minHeight: '100px', border: '2px solid #6B5B95', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin:'20px', borderRadius: '15px'}}>
                            <div style={{marginTop:'15px', fontSize:'15px', display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', marginBottom:'15px'}}>
                              {rows}
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

                              Parameter Dictionary (Please paste a dictionary here.)
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

              else if(res.data['nodes'][i]['csv_node'] == 0 && res.data['nodes'][i]['dataset_node'] == 0){

                    variable_nodes.push(
                      <div>
                        <div onClick={() => viewNode(index)} style={{cursor:'pointer', fontWeight: 'bold', color:'black', fontSize:'15px', minWidth: '200px', minHeight: '100px', border: '2px solid #1B4D3E', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin:'20px', borderRadius: '15px'}}>
                            <div style={{marginTop:'15px', fontSize:'15px', display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', marginBottom:'15px'}}>
                              {rows}
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

                              Parameter Dictionary (Please paste a dictionary here.)
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
                <div>
                  <div onClick={() => viewNode(index)} style={{cursor:'pointer', padding:'10px', fontWeight: 'bold', color:'white', fontSize:'15px', width: '650px', minHeight: '70px', border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', margin:'20px', backgroundColor: '#34568B', borderRadius: '15px'}}>
                    <div style={{whiteSpace: 'pre-wrap', wordBreak: 'break-all'}}>{res.data['nodes'][i]['description']}</div>
                  </div>

                  <Modal visible={nodeViewModalDict[res.data['nodes'][i]['id']]} closable={false} footer={null}>

                    {editNodeViewModalDict[res.data['nodes'][i]['id']] == true ?

                    <Form
                      initialValues={{ remember: true,}}
                      {...layout}
                      onFinish={onFinish}
                      style={{fontFamily: 'Helvetica, Arial, sans-serif'}}>
                        <Form.Item name={'node_id'} initialValue={res.data['nodes'][i]['id']} hidden={true}></Form.Item>

                        Description
                        <Form.Item name={"node_description"} initialValue={res.data['nodes'][i]['description']}>
                          <TextArea rows={8} showCount placeholder="Description" style={{width:'450px'}} defaultValue={res.data['nodes'][i]['description']} />
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
                      <div style={{whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize:'15px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom:'15px'}}>
                        {res.data['nodes'][i]['description']}
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
            else if(res.data['nodes'][i]['node_type'] == 2){

               result_nodes.push(
                <div>
                  <div onClick={() => viewNode(index)} style={{cursor:'pointer', color:'black', fontSize:'15px', minWidth: '200px', minHeight: '100px', border: '4px solid #FF6F61', display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', margin:'20px', backgroundColor:'white', borderRadius: '15px'}}>

                      <div style={{fontSize:'15px', display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', marginBottom:'15px'}}>

                      <div style={{border: '1px solid black'}}>
                        {rows}
                      </div>  

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

                      <div style={{marginTop:'20px', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                        Confusion Matrix

                        {cmatrix}

                      </div>

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

                        Parameter Dictionary (Please paste a dictionary here.)
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
                      <div style={{fontSize:'15px', display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', marginBottom:'15px'}}>

                      <div style={{border: '1px solid black'}}>
                        {rows}
                      </div>                      
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
                      />

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

                      <div style={{marginTop:'20px', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                        Confusion Matrix

                        {cmatrix}
                        
                      </div>


                      <div style={{marginTop: '15px'}}>
                        <Button style={{marginRight:10, color:'blue'}}  shape="circle" onClick={()=>closeNode(index)}> < CloseOutlined /> </Button>  <Button onClick={() => editNode(index)} style={{marginRight:10, color:'blue'}}  shape="circle"> < EditOutlined /> </Button>
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

        }})
    })
    .catch(err => {
      console.log(err.response.data); //style={{display:'flex', flexDirection:'column', justifyContent:'center'}}
      navigate("/login")
    })
  }, [props, refresh]);


  const createNodeModal = (node_type) => {
    setIsCreateNodeModalOpen(true)
    setNodeType(node_type)
  }

  const onNodeCreate = (values)  => {

    let form_data = new FormData();

    for (const [key, value] of Object.entries(values))
      form_data.append(key, value)

    form_data.append('run_id', props.run_id)
    form_data.append('node_type', nodeType)

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
        data: form_data,
        headers: {
          'Authorization': "JWT " + localStorage.getItem('access_token'),
          'content-type': 'multipart/form-data',
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

  const onFileUpload = (values)  => {
    console.log(values)

    let form_data = new FormData();

    let lol = []

    if (values.files && values.files.file) {
        form_data.append('file', values.files.file);
    } 
    else {
        form_data.append('file', null); // or handle the absence of a file
    }

    form_data.append('run_id', props.run_id)

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
        data: form_data,
        headers: {
          'Authorization': "JWT " + localStorage.getItem('access_token'),
          'content-type': 'multipart/form-data',
          'X-CSRFToken': csrftoken}} )
      .then(res => { 
          setIsFileModalOpen(false)           
          setRefresh((prevValue) => prevValue + 1)
        })
    })
    .catch(err => {
      console.log(err)
      console.log("Error")
      navigate("/login")
    })
  }



  return (
    <div>

    <Modal visible={isCreateNodeModalOpen} closable={false} footer={null}>
      <Form
        form={form}
        name="createNode"
        {...layout}
        onFinish={onNodeCreate}
      >
        <div>Name</div>

        <Form.Item name="node_description">
            <TextArea rows={5} />
        </Form.Item>

        <Form.Item>
          <Button onClick={()=>setIsCreateNodeModalOpen(false)}>Cancel</Button> <Button type="primary" style={{backgroundColor:'purple'}} htmlType="submit">Create</Button>
        </Form.Item>
      </Form>
    </Modal>

    <Modal visible={isDeleteNodeModalOpen} closable={false}  footer={null}>
        <div style={{color:'red', marginBottom:'15px'}}><u>Are you sure you want to delete this Node? Deleted Nodes cannot be restored.</u></div>
        <Button onClick={()=>setIsDeleteNodeModalOpen(false)}>Cancel</Button> <Button type="primary" style={{backgroundColor:'red'}} onClick={handleDeleteNodeOk}>Delete</Button>
    </Modal>


      <Modal visible={isFileModalOpen} closable={false} footer={null}>

          

          <Form onFinish={onFileUpload}>
            <Form.Item name="files" >
              <Upload name="logo" listType="picture" beforeUpload={() => false}>
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button style={{marginRight:'5px'}} onClick={()=>setIsFileModalOpen(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">Update</Button>
            </Form.Item>
          </Form>

          {downloadWeights}
          {downloadNetwork}
          {files}

      </Modal> 



      { props.run_id != -1 ? 

        <div style={{display:'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center'}}>
          <div style={{marginBottom:'15px', color:'#003568', fontSize:'17px', fontWeight:'bold'}}> 

          <Tooltip placement="top" title="Files">
            <Button size="medium" shape="circle" style={{marginRight:'5px'}} onClick={()=>setIsFileModalOpen(true)}> <NodeIndexOutlined /> </Button>
          </Tooltip> 

          <Dropdown overlay={systemInfo}>
            <Tooltip placement="top" title="System">
              <Button size="medium" shape="circle" style={{marginRight:'5px'}}> <DesktopOutlined /> </Button> 
            </Tooltip>
          </Dropdown>

          <Dropdown overlay={libraries}>
            <Tooltip placement="top" title="Libraries">
              <Button size="medium" shape="circle" style={{marginRight:'5px'}}> <ApartmentOutlined /> </Button>
            </Tooltip> 
          </Dropdown>

          Run ID: {props.run_id}</div> 

          <div style={{color:'#38b6ff', fontSize:'20px', fontWeight:'bold'}}>Dataset <PlusCircleOutlined onClick={()=>createNodeModal(0)} /></div>
          <div style={{display:'flex', flexDirection:'row', justifyContent: 'center', alignItems: 'center', flexWrap:'wrap'}}>
            {datasetNodes}
          </div>

          <div style={{color:'#38b6ff', fontSize:'20px', fontWeight:'bold'}}>Variables <PlusCircleOutlined onClick={()=>createNodeModal(1)} /></div>
          <div style={{display:'flex', flexDirection:'row', justifyContent: 'center', alignItems: 'center', flexWrap:'wrap'}}>
            {variableNodes}
          </div>

          <div style={{color:'#38b6ff', fontSize:'20px', fontWeight:'bold'}}>CSV</div>
          <div style={{display:'flex', flexDirection:'row', justifyContent: 'center', alignItems: 'center', flexWrap:'wrap'}}>
            {csvNodes}
          </div>

          <div style={{color:'#38b6ff', fontSize:'20px', fontWeight:'bold'}}>Methodology <PlusCircleOutlined onClick={()=>createNodeModal(2)} /></div>
          <div style={{display:'flex', flexDirection:'row', justifyContent: 'center', alignItems: 'center', flexWrap:'wrap'}}>
            {methodNodes}
          </div>

          <div style={{color:'#38b6ff', fontSize:'20px', fontWeight:'bold'}}>Results <PlusCircleOutlined onClick={()=>createNodeModal(3)} /></div>
          <div style={{display:'flex', flexDirection:'row', justifyContent: 'center', alignItems: 'center', flexWrap:'wrap'}}>
            {resultNodes}
          </div>
        </div>
      :
        null}

    </div>
  );
};

export default CreateGraph;
