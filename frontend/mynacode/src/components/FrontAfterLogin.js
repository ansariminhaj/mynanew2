import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import IP from "../components/ipConfig";
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Layout, Menu, Divider, Affix, Button, Modal, notification, Tooltip, Dropdown, Switch} from 'antd';
import CreateGraph from "../components/CreateGraph";
import Outline from "../components/Outline";
import { MoreOutlined, LeftCircleOutlined, EditOutlined, DeleteOutlined, ShareAltOutlined, PlusCircleOutlined } from '@ant-design/icons';
import "./index.css";
import protocol from "../components/httpORhttps";
import type { NotificationPlacement } from 'antd/es/notification/interface';
import { Bar, Line, Scatter, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Legend } from 'chart.js/auto'
import { Chart }            from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Legend);

const { TextArea } = Input;

const { Content, Sider } = Layout;

const layout = {
  labelCol: {
    span: 2,
  },
  wrapperCol: {
    span: 10,
  },
};


const FrontAfterLogin = (props) => {
  const navigate = useNavigate()
  const [menu, setMenu] = useState([]);
  const [refreshParent, setRefreshParent] = useState(0);

  const [runID, setRunID] = useState(-1);
  const [editRunID, setEditRunID] = useState(-1);
  const [editRunName, setEditRunName] = useState("");

  const [projectID, setProjectID] = useState(-1);
  const [editProjectID, setEditProjectID] = useState(-1);
  const [editProjectName, setEditProjectName] = useState("");

  const [isRunModalOpen, setIsRunModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isProjectShareModalOpen, setIsProjectShareModalOpen] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const [isRunDeleteModalOpen, setIsRunDeleteModalOpen] = useState(false);
  const [isProjectDeleteModalOpen, setIsProjectDeleteModalOpen] = useState(false);

  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [isCreateRunModalOpen, setIsCreateRunModalOpen] = useState(false);

  const [showOutline, setShowOutline] = useState("")

  const [refresh, setRefresh] = useState(0)

  const [form] = Form.useForm();


  const handleDeleteRunOk = () => {
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
          url: protocol+'://'+IP+'/api/run_delete',
          data: {'run_id': editRunID},
          headers: {
            'Authorization': "JWT " + localStorage.getItem('access_token'),
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken}} )
        .then(res => {
           if(res.data == 'OK')
              setIsRunDeleteModalOpen(false)
              setIsRunModalOpen(false)
              setEditRunID(-1)
              setRunID(-1)
              setRefresh((prevValue) => prevValue + 1) 
        })
        .catch(err => {
          console.log(err.response.data);
        })
      })
  };


  const handleDeleteProjectOk = () => {
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
          url: protocol+'://'+IP+'/api/project_delete',
          data: {'project_id': editProjectID},
          headers: {
            'Authorization': "JWT " + localStorage.getItem('access_token'),
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken}} )
        .then(res => {
           if(res.data == 'OK')
              setIsProjectDeleteModalOpen(false)
              setIsProjectModalOpen(false)
              setProjectID(-1)
              setEditProjectID(-1);
              setRefresh((prevValue) => prevValue + 1) 
        })
        .catch(err => {
          console.log(err.response.data);
        })
      })
  };


  const duplicateRun = () => {
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
          url: protocol+'://'+IP+'/api/duplicate_run',
          data: {'run_id': editRunID},
          headers: {
            'Authorization': "JWT " + localStorage.getItem('access_token'),
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken}} )
        .then(res => {
           if(res.data == 'OK')
              setIsRunModalOpen(false)
              setRefresh((prevValue) => prevValue + 1) 
        })
        .catch(err => {
          console.log(err.response.data);
        })
      })
  };


  function getItem(label, key, children, type) {
    return {
      key,
      children,
      label,
      type,
    };
  }

  const editRunModalOpen = (runID, runName) => {
    console.log("t")
    setEditRunID(runID)
    setEditRunName(runName)
    setIsRunModalOpen(true)
    form.setFieldsValue({
      run_name:runName
    })
  }

  const editProjectModalOpen = (projectID, projectName) => {
    setEditProjectID(projectID)
    setEditProjectName(projectName)
    setIsProjectModalOpen(true)
    form.setFieldsValue({
      project_name:projectName
    })
  }

  const onRunEdit = (values) => {
      console.log(values)
      let form_data = new FormData();

      for (const [key, value] of Object.entries(values))
        form_data.append(key, value)

      form_data.append('run_id', editRunID)

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
          url: protocol+'://'+IP+'/api/run_update',
          data: form_data,
          headers: {
            'Authorization': "JWT " + localStorage.getItem('access_token'),
            'content-type': 'multipart/form-data',
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken}} )
        .then(res => {
           if(res.data == 'OK')
              setIsRunModalOpen(false)
              setRefresh((prevValue) => prevValue + 1) 
        })
        .catch(err => {
          console.log(err.response.data);
        })
      })     
  };


  const onProjectEdit = (values) => {
      console.log(values)
      let form_data = new FormData();

      for (const [key, value] of Object.entries(values))
        form_data.append(key, value)

      form_data.append('project_id', editProjectID)

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
          url: protocol+'://'+IP+'/api/project_update',
          data: form_data,
          headers: {
            'Authorization': "JWT " + localStorage.getItem('access_token'),
            'content-type': 'multipart/form-data',
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken}} )
        .then(res => {
           if(res.data == 'OK')
              setIsProjectModalOpen(false)
              setRefresh((prevValue) => prevValue + 1) 
        })
        .catch(err => {
          console.log(err.response.data);
        })
      })     
  };


  const onProjectCreate = (values) => {
      console.log(values)
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
          url: protocol+'://'+IP+'/api/create_project',
          data: form_data,
          headers: {
            'Authorization': "JWT " + localStorage.getItem('access_token'),
            'content-type': 'multipart/form-data',
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken}} )
        .then(res => {
           if(res.data == 'OK')
              setIsCreateProjectModalOpen(false)
              setRefresh((prevValue) => prevValue + 1) 
        })
        .catch(err => {
          console.log(err.response.data);
        })
      })     
  };

  const onRunCreate = (values) => {
      console.log(values)
      let form_data = new FormData();

      for (const [key, value] of Object.entries(values))
        form_data.append(key, value)

      form_data.append('project_id', projectID)

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
          url: protocol+'://'+IP+'/api/create_run',
          data: form_data,
          headers: {
            'Authorization': "JWT " + localStorage.getItem('access_token'),
            'content-type': 'multipart/form-data',
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken}} )
        .then(res => {
           if(res.data == 'OK')
              setIsCreateRunModalOpen(false)
              setRefresh((prevValue) => prevValue + 1) 
        })
        .catch(err => {
          console.log(err.response.data);
        })
      })     
  };



  const openNotificationWithIcon = (type) => {
    api[type]({
      message: 'Project shared successfully!',
    });
  };

  const onProjectShare = (values) => {
      console.log(values)
      let form_data = new FormData();

      for (const [key, value] of Object.entries(values))
        form_data.append(key, value)

      form_data.append('project_id', editProjectID)

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
          url: protocol+'://'+IP+'/api/project_share',
          data: form_data,
          headers: {
            'Authorization': "JWT " + localStorage.getItem('access_token'),
            'content-type': 'multipart/form-data',
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken}} )
        .then(res => {
           if(res.data == 'OK'){
              setIsProjectShareModalOpen(false)
              openNotificationWithIcon('success')}
        })
        .catch(err => {
          console.log(err.response.data);
        })
      })     
  };


  const toggleEnable = (projectID) => {
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
          url: protocol+'://'+IP+'/api/toggle_enable',
          data: {'project_id': projectID},
          headers: {
            'Authorization': "JWT " + localStorage.getItem('access_token'),
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken}} )
        .then(res => {
           if(res.data == 'OK'){
            setRefresh((prevValue) => prevValue + 1) 
           }
        })
        .catch(err => {
          console.log(err.response.data);
        })
      }) 
  }

  const getOutline = () => {
    setShowOutline(1)  
  }

  const getRuns = (projectID, projectName) => {
    setProjectID(projectID)

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
        url: protocol+'://'+IP+'/api/get_runs',
        data: {'project_id': projectID},
        headers: {
          'Authorization': "JWT " + localStorage.getItem('access_token'),
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken}} )
      .then(res => {            
          let runs = res.data.runs

          let items = [getItem(<div id={-1} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontWeight:'bold', color:'#38b6ff'}}><button onClick={getProjects}>Projects</button> <span style={{marginRight:'60px'}}>Runs <PlusCircleOutlined onClick={()=>setIsCreateRunModalOpen(true)} /></span></div>)]
        
          items.push(getItem(<div style={{ display:'flex', flexDirection:'row', justifyContent:'space-around', alignItems:'center', fontWeight:'bold'}}>
                                  <div style={{maxWidth:'100px'}} onClick={()=>getOutline(projectID)}>Outline</div> 
                      </div>))

          for(let i=0;i<runs.length;i++){
              if(i == 0 && runID==-1){
                setRunID(runs[i]['id'])
              }
              items.push(getItem(<div style={{ display:'flex', flexDirection:'row', justifyContent:'space-around', alignItems:'center', fontWeight:'bold'}}>
                                      <MoreOutlined style={{marginRight:'10px', fontSize:'20px'}}  onClick={()=>editRunModalOpen(runs[i]['id'], runs[i]['run_name'])}/> 
                                      <div style={{maxWidth:'100px'}} onClick={getNodes(runs[i]['id'], runs[i]['run_name'])}> {runs[i]['run_name'] } </div>
                                      <span style={{fontSize:'10px', marginLeft: 'auto', marginRight: 0}}>{runs[i]['run_date'].slice(0, 10) }</span>     
                                </div>))
          }

          setMenu(<Menu
                mode="inline"
                style={{
                  width: 280,
                  fontFamily: 'Helvetica, Arial, sans-serif', 
                  fontSize: '15px',
                  backgroundColor:'white',
                  //border:'4px solid #38b6ff',
                  fontWeight: 'bold'
                }}
                items={items}
              />)

        })
    })
    .catch(err => {
      console.log(err.response.data);
      navigate("/login")
    })

  }


  useEffect(() => {
    if(projectID!=-1){
      getRuns(projectID)
    }
    else{
      getProjects()
    }

  }, [props, refresh]);


  function getProjects(){
    setRunID(-1)
    setProjectID(-1)
    setShowOutline(-1)
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
        url: protocol+'://'+IP+'/api/get_projects',
        headers: {
          'Authorization': "JWT " + localStorage.getItem('access_token'),
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken}} )
      .then(res => {         
          let projects = res.data

          let items = [getItem(<div style={{ display:'flex', justifyContent:'center', alignItems:'center', fontWeight:'bold', color:'#38b6ff', fontSize:'17px'}}><span style={{marginRight: '10px'}}>Projects</span> <PlusCircleOutlined onClick={()=>setIsCreateProjectModalOpen(true)} /></div>)]

          for(let i=0;i<projects.length;i++){
              items.push(getItem(<div style={{ display:'flex', flexDirection:'row', justifyContent:'space-around', alignItems:'center', fontWeight:'bold'}}>
                                  <Switch style={{marginRight:'10px'}} size="small" checked={projects[i]['enable']} onClick={()=>toggleEnable(projects[i]['id'])} />
                                  <div style={{maxWidth:'100px'}} onClick={()=>getRuns(projects[i]['id'], projects[i]['name'])}>{projects[i]['name']}</div> 
                                  <MoreOutlined style={{marginLeft: 'auto', marginRight: 0, fontSize:'20px'}} onClick={()=>editProjectModalOpen(projects[i]['id'], projects[i]['name'])}/>
                                </div>))
          }

          setMenu(<Menu
                mode="inline"
                style={{
                  width: 280,
                  fontFamily: 'Helvetica, Arial, sans-serif', 
                  fontSize: '15px',
                  backgroundColor:'white',
                  //border:'4px solid #38b6ff',
                  fontWeight: 'bold'
                }}
                items={items}
              />)

        })
    })
    .catch(err => {
      console.log(err.response.data);
      navigate("/login")
    })

  }


  const getNodes = (runID, runName) => (e) => {
    console.log(runID)
    setShowOutline(0)
    setRunID(runID)
  }


  return (

    <Layout style={{display: 'flex', flexDirection:'row'}}>
        
      <div style={{backgroundColor:'white'}}>
        <Layout>

          {menu}

        </Layout>
      </div>

      <div style={{paddingLeft:'130px'}}>
        <Modal visible={isRunModalOpen} closable={false} footer={null}>
          <Form
            form={form}
            name="editRun"
            {...layout}
            onFinish={onRunEdit}
          >
            <div>Name</div>
            <Form.Item name="run_name">
              <Input />
            </Form.Item>
            <div style={{color:'red', marginBottom:'15px'}}><u style={{cursor:'pointer', marginRight:'15px'}} onClick={()=>setIsRunDeleteModalOpen(true)}>Delete Run</u> <u style={{cursor:'pointer', color:'purple'}} onClick={duplicateRun}>Duplicate Run</u></div>
            <Form.Item>
              <Button onClick={()=>setIsRunModalOpen(false)}>Cancel</Button> <Button type="primary" htmlType="submit">Update</Button>
            </Form.Item>
          </Form>
        </Modal>


        <Modal visible={isProjectModalOpen} closable={false} footer={null}>
          <Form
            form={form}
            name="editProject"
            {...layout}
            onFinish={onProjectEdit}
          >
            <div>Name</div>
            <Form.Item name="project_name">
              <Input /> 
            </Form.Item>
            <Form.Item>
              <Button onClick={()=>setIsProjectModalOpen(false)}>Cancel</Button> <Button type="primary" htmlType="submit">Update</Button>
            </Form.Item>
            <DeleteOutlined style={{color:'red', marginBottom:'15px',  marginRight:'15px', fontSize: '16px', cursor:'pointer'}} onClick={()=>setIsProjectDeleteModalOpen(true)} /> <ShareAltOutlined style={{color:'purple', marginBottom:'15px', fontSize: '16px', cursor:'pointer'}} onClick={()=>setIsProjectShareModalOpen(true)}/>
          </Form>
          Project ID: {editProjectID}
        </Modal>

        <Modal visible={isProjectShareModalOpen} closable={false} footer={null}>
          <Form
            form={form}
            name="shareProject"
            {...layout}
            onFinish={onProjectShare}
          >
            <div>Share with</div>
            <Form.Item name="user_name">
              <Input placeholder="Username"/> 
            </Form.Item>
            <Form.Item>
              <Button onClick={()=>setIsProjectShareModalOpen(false)}>Cancel</Button> <Button type="primary" style={{backgroundColor:'purple'}} htmlType="submit">Share</Button>
            </Form.Item>
          </Form>
        </Modal>                                    


        <Modal visible={isCreateProjectModalOpen} closable={false} footer={null}>
          <Form
            form={form}
            name="createProject"
            {...layout}
            onFinish={onProjectCreate}
          >
            <div>Name</div>
            <Form.Item name="project_name">
              <Input placeholder="Project Name"/> 
            </Form.Item>

            <Form.Item>
              <Button onClick={()=>setIsCreateProjectModalOpen(false)}>Cancel</Button> <Button type="primary" style={{backgroundColor:'purple'}} htmlType="submit">Create</Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal visible={isCreateRunModalOpen} closable={false} footer={null}>
          <Form
            form={form}
            name="createRun"
            {...layout}
            onFinish={onRunCreate}
          >
            <div>Name</div>
            <Form.Item name="run_name">
              <Input placeholder="Run Name"/> 
            </Form.Item>

            <Form.Item>
              <Button onClick={()=>setIsCreateRunModalOpen(false)}>Cancel</Button> <Button type="primary" style={{backgroundColor:'purple'}} htmlType="submit">Create</Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal visible={isRunDeleteModalOpen} closable={false}  footer={null}>
            <div style={{color:'red', marginBottom:'15px'}}><u>Are you sure you want to delete this run? Deleted runs cannot be restored.</u></div>
            <Button onClick={()=>setIsRunDeleteModalOpen(false)}>Cancel</Button> <Button type="primary" style={{backgroundColor:'red'}} onClick={handleDeleteRunOk}>Delete</Button>
        </Modal>

        <Modal visible={isProjectDeleteModalOpen} closable={false}  footer={null}>
            <div style={{color:'red', marginBottom:'15px'}}><u>Are you sure you want to delete this project? Deleted projects cannot be restored.</u></div>
            <Button onClick={()=>setIsProjectDeleteModalOpen(false)}>Cancel</Button> <Button type="primary" style={{backgroundColor:'red'}} onClick={handleDeleteProjectOk}>Delete</Button>
        </Modal>

        <Content style={{minHeight:'100vh', padding: '10px 0px 10px 30px', fontFamily: 'Helvetica, Arial, sans-serif', display: 'flex', flexDirection:'column'}}>
          <Layout>
              {showOutline == 1 ?
                <Outline project_id = {projectID} />
                :
                <CreateGraph run_id = {runID} refresh = {refresh}/>
              }

          </Layout>
        </Content>

      </div>

    </Layout>



  );
  
};

export default FrontAfterLogin;