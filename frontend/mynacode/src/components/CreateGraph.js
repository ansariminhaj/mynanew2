import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import IP from "../components/ipConfig";
import { useNavigate, Link } from 'react-router-dom';
import { Button, Tooltip, Popover, Checkbox, Form, Input, Alert, Modal, Switch, Dropdown, Menu } from 'antd';
import { PlusCircleOutlined, EditOutlined, AlignLeftOutlined, ApartmentOutlined, ExpandOutlined, CloseOutlined, CheckOutlined, DesktopOutlined, CodeOutlined } from '@ant-design/icons';
import '../components/index.css';
import protocol from "../components/httpORhttps";
import * as actions from '../store/actions/actions';
import { connect } from 'react-redux';
import { Bar } from "react-chartjs-2";
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
const options = {
  scales: {
    x: {
      type: "linear",
      offset: false,
      gridLines: {
        offsetGridLines: false
      },
      title: {
        display: true,
        text: "Arrivals per minute"
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

  const [inputNodes, setInputNodes] = useState([])
  const [methodNodes, setMethodNodes] = useState([])
  const [resultNodes, setResultNodes] = useState([])
  const [nodeType, setNodeType] = useState(-1)
  const [nodeViewModalDict, setNodeViewModalDict] = useState({})
  const [editNodeViewModalDict, setEditNodeViewModalDict] = useState({})
  const [editNodeID, setEditNodeID] = useState(-1);

  const [systemInfo, setSystemInfo] = useState([]);
  const [libraries, setLibraries] = useState([]);
  const [filepaths, setFilepaths] = useState([]);

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
          let input_nodes = []
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
          
          

          if (res.data['nodes']){
            for(var i=0;i<res.data['nodes'].length;i++){
              let index = res.data['nodes'][i]['id']
              let rows = []
              let count = 0
              let color = 'white'

              if(res.data['nodes'][i]['node_type'] == 0  && res.data['nodes'][i]['csv_node'] == 0 && res.data['nodes'][i]['dataset_node'] == 0){
                for(const [key, value] of Object.entries(res.data['nodes'][i]['description'])){
                  count+=1
                  if(count%2==0)
                    color = '#E0E0E0'
                  else
                    color='white'
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

                  rows.push(<div style={{marginTop:'10px'}}> Size (in KB): {size}</div>)
                  rows.push(<div> Shape: {shape}</div>)

                  rows.push(<div style={{width:'100%', backgroundColor: '#38b6ff', display:'flex', flexDirection:'row'}}><div style={{paddingLeft: '10px', width:'200px'}}>Column</div><div style={{width:'110px'}}>Unique</div><div style={{width:'110px'}}>Null</div><div style={{width:'110px'}}>Datatype</div></div>)

                  for(let i=0; i<parsed_columns.length; i++){
                    count+=1
                    if(count%2==0)
                      color = '#E0E0E0'
                    else
                      color='white'
                    rows.push(<div style={{width:'100%', backgroundColor: color, display:'flex', flexDirection:'row'}}><div style={{paddingLeft: '10px', width:'200px'}}>{parsed_columns[i]}</div><div style={{width:'110px'}}>{parsed_unique[i]}</div><div style={{width:'110px'}}>{parsed_null[i]}</div><div style={{width:'110px'}}>{parsed_dtypes[i]}</div></div>)
                   
                   }
                  }
              }
              else if (res.data['nodes'][i]['node_type'] == 0 && res.data['nodes'][i]['dataset_node'] == 1){
                if (res.data['nodes'][i]['description']){

                  console.log(res.data['nodes'][i]['description']['train set'])
                   let parsed_trainset = JSON.parse(res.data['nodes'][i]['description']['train set'].replace(/'/g, '"'))
                   let parsed_valset = JSON.parse(res.data['nodes'][i]['description']['val set'].replace(/'/g, '"'))
                   let parsed_testset = JSON.parse(res.data['nodes'][i]['description']['test set'].replace(/'/g, '"'))
                   
                   rows.push(<div style={{color: '#38b6ff', fontSize:'15px', fontWeight:'bold', marginTop:'10px', marginBottom:'15px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}> Train Set </div>)   

                   for (const [key, value] of Object.entries(parsed_trainset)){
                    rows.push(<div style={{width:'100%', backgroundColor: color, display:'flex', flexDirection:'row'}}><div style={{paddingLeft: '10px', width:'200px'}}>{key}</div><div style={{width:'110px'}}>{value}</div></div>)
                   }    

                   rows.push(<div style={{color: '#38b6ff', fontSize:'15px', fontWeight:'bold', marginTop:'10px', marginBottom:'15px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}> Validation Set </div>)   

                   for (const [key, value] of Object.entries(parsed_valset)){
                    rows.push(<div style={{width:'100%', backgroundColor: color, display:'flex', flexDirection:'row'}}><div style={{paddingLeft: '10px', width:'200px'}}>{key}</div><div style={{width:'110px'}}>{value}</div></div>)
                   }   


                   rows.push(<div style={{color: '#38b6ff', fontSize:'15px', fontWeight:'bold', marginTop:'10px', marginBottom:'15px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}> Test Set </div>)   

                   for (const [key, value] of Object.entries(parsed_testset)){
                    rows.push(<div style={{width:'100%', backgroundColor: color, display:'flex', flexDirection:'row'}}><div style={{paddingLeft: '10px', width:'200px'}}>{key}</div><div style={{width:'110px'}}>{value}</div></div>)
                   }       
                }
              }
              else if (res.data['nodes'][i]['node_type'] == 2){
                if (res.data['nodes'][i]['description']){
                  console.log(res.data['nodes'][i]['description']['freq'])
                  let c_matrix = res.data['nodes'][i]['description']['c_matrix']
                  let freq = res.data['nodes'][i]['description']['freq']
                  let bins = res.data['nodes'][i]['description']['bins']
                  let fpr = res.data['nodes'][i]['description']['fpr']
                  let tpr = res.data['nodes'][i]['description']['tpr']
                  console.log(c_matrix, freq, tpr, fpr, bins)
                }
              }


              if (res.data['nodes'][i]['node_type'] == 0){

                input_nodes.push( //Modal is in div. Therefore check if false before opening
                  <div>
                    <div onClick={() => viewNode(index)} style={{fontWeight: 'bold', color:'white', fontSize:'15px', width: '200px', height: '100px', border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', margin:'20px', backgroundColor:'#6B5B95', borderRadius: '15px'}}>
                      <p style={{margin: 'auto', cursor:'pointer'}}>{res.data['nodes'][i]['name']}</p>
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
                          <div style={{color:'red', marginBottom:'15px'}}><u style={{cursor:'pointer'}} onClick={()=>setIsDeleteNodeModalOpen(true)}>Delete Node</u></div>

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
            else if(res.data['nodes'][i]['node_type'] == 1){


               method_nodes.push(
                <div>
                  <div onClick={() => viewNode(index)} style={{fontWeight: 'bold', color:'white', fontSize:'15px', width: '200px', height: '100px', border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', margin:'20px', backgroundColor: '#34568B', borderRadius: '15px'}}>
                    <p style={{margin: 'auto', cursor:'pointer'}}>{res.data['nodes'][i]['name']}</p>
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
                        <Form.Item name={"node_description"} initialValue={res.data['nodes'][i]['description']}>
                          <TextArea rows={8} showCount placeholder="Description" style={{width:'450px'}} defaultValue={res.data['nodes'][i]['description']} />
                        </Form.Item> 

                        <Form.Item>
                          <Button style={{marginRight:10, color:'blue'}}  shape="circle" onClick={()=>closeEditNode(index)}> < CloseOutlined /> </Button> 
                          <Button htmlType="submit" style={{marginRight:10, color:'blue'}} shape="circle" onClick={()=>closeEditNode(index)} > < CheckOutlined /> </Button>
                        </Form.Item>
                        <div style={{color:'red', marginBottom:'15px'}}><u style={{cursor:'pointer'}} onClick={()=>setIsDeleteNodeModalOpen(true)}>Delete Node</u></div>

                      </Form>
                      :
                      <div>
                      <span style={{color:'blue'}}>Created {res.data['nodes'][i]['date'].slice(0, 10)}</span>
                      <div style={{fontSize:'20px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom:'15px'}}>
                        {res.data['nodes'][i]['name']}
                      </div>

                      <div style={{whiteSpace: 'pre-wrap'}}>
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
                  <div onClick={() => viewNode(index)} style={{fontWeight: 'bold', color:'white', fontSize:'15px', width: '200px', height: '100px', border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', margin:'20px', backgroundColor:'#FF6F61', borderRadius: '15px'}}>
                    <p style={{margin: 'auto', cursor:'pointer'}}>{res.data['nodes'][i]['name']}</p>
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
                        <div style={{color:'red', marginBottom:'15px'}}><u style={{cursor:'pointer'}} onClick={()=>setIsDeleteNodeModalOpen(true)}>Delete Node</u></div>

                      </Form>
                      :
                      <div>
                      <span style={{color:'blue'}}> Created {res.data['nodes'][i]['date'].slice(0, 10)} </span>
                      <div style={{fontSize:'20px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom:'15px'}}>
                        {res.data['nodes'][i]['name']}
                      </div>

                      <div style={{border: '1px solid black'}}>
                        {rows}
                      </div>                      
                      <Bar
                        data={{
                          labels: labels,
                          datasets: [
                            {
                              borderColor: "blac",
                              lineTension: 0,
                              fill: false,
                              borderJoinStyle: "round",
                              data: data,
                              borderWidth: 0.2,
                              barPercentage: 1,
                              categoryPercentage: 1,
                              hoverBackgroundColor: "darkgray",
                              barThickness: "flex"
                            }
                          ]
                        }}
                        options={options}
                      />
                      <div style={{marginTop: '15px'}}>
                        <Button style={{marginRight:10, color:'blue'}}  shape="circle" onClick={()=>closeNode(index)}> < CloseOutlined /> </Button>  <Button onClick={() => editNode(index)} style={{marginRight:10, color:'blue'}}  shape="circle"> < EditOutlined /> </Button>
                      </div>
                      </div>
                    }

                  </Modal>
                </div>

              )               
            }
            else{
              //do nothing
            }

          }

          setInputNodes(input_nodes)
          setMethodNodes(method_nodes)
          setResultNodes(result_nodes)

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
        <Form.Item name="node_name">
          <Input placeholder="Node Name"/> 
        </Form.Item>

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


      { props.run_id != -1 ? 

        <div style={{display:'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center'}}>
          <div style={{marginBottom:'15px', color:'#003568', fontSize:'17px', fontWeight:'bold'}}> 

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

          <div style={{color:'#38b6ff', fontSize:'20px', fontWeight:'bold'}}>Input <PlusCircleOutlined onClick={()=>createNodeModal(0)} /></div>
          <div style={{display:'flex', flexDirection:'row', justifyContent: 'center', alignItems: 'center', flexWrap:'wrap'}}>
            {inputNodes}
          </div>

          <div style={{color:'#38b6ff', fontSize:'20px', fontWeight:'bold'}}>Methodology <PlusCircleOutlined onClick={()=>createNodeModal(1)} /></div>
          <div style={{display:'flex', flexDirection:'row', justifyContent: 'center', alignItems: 'center', flexWrap:'wrap'}}>
            {methodNodes}
          </div>

          <div style={{color:'#38b6ff', fontSize:'20px', fontWeight:'bold'}}>Results <PlusCircleOutlined onClick={()=>createNodeModal(2)} /></div>
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
