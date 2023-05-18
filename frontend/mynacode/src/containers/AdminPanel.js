import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import IP, {IP_image} from "../components/ipConfig";
import { useNavigate, Link } from 'react-router-dom';
import { Layout, Menu, Divider, List, Button} from 'antd';
import CreateGraph from "../components/CreateGraph";
import { LeftCircleOutlined } from '@ant-design/icons';
import protocol from "../components/httpORhttps";


const { Content, Sider } = Layout;

const AdminPanel = (props) => {
  const navigate = useNavigate()
  const [menuItem, setMenuItem] = useState(-1);
  const [numberUsers, setNumberUsers] = useState(null);
  const [numberProjects, setNumberProjects] = useState(null);
  const [feedback, setFeedback] = useState([])
  const [feedbackCounter, setFeedbackCounter] = useState(0)


  function getItem(label, key, children, type) {
    return {
      key,
      children,
      label,
      type,
    };
  }

  let items_list=[ 
  getItem(<div id={0} style={{ display:'flex', justifyContent:'center', alignItems:'center', fontWeight:'bold', color:'#38b6ff', fontSize:'17px'}}>Metrics</div>),
  getItem(<div id={1} style={{ display:'flex', justifyContent:'center', alignItems:'center', fontWeight:'bold', color:'#38b6ff', fontSize:'17px'}}>Feedback</div>)]

  function getUserMetrics(){
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
          url: protocol+'://'+IP+'/api/get_admin_metrics',
          headers: {
            'Authorization': "JWT " + localStorage.getItem('access_token'),
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken}} )
        .then(res => {            
            let metrics = res.data
            setNumberUsers(metrics['user_count'])
            setNumberProjects(metrics['projects_count'])
          })
      })
      .catch(err => {
        console.log(err.response.data);
        navigate("/login")
      })
  }


  function getUserFeedback(count){
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
          url: protocol+'://'+IP+'/api/get_admin_feedback',
          data: {'count': count}, 
          headers: {
            'Authorization': "JWT " + localStorage.getItem('access_token'),
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken}} )
        .then(res => {   
            let feedback_list = res.data
            console.log(feedback_list)
            setFeedback(feedback_list)

          })
      })
      .catch(err => {
        console.log(err.response.data);
        navigate("/login")
      })  
  }


  function selectDoc(e){
    setMenuItem(e.domEvent.target.id)

    if (e.domEvent.target.id == 0){
        getUserMetrics()
    }
    else{
        setFeedbackCounter(0)
        getUserFeedback(0)
    }
  }

  function nextFeedback(){
        setFeedbackCounter(prevCount => prevCount + 1)
        getUserFeedback(feedbackCounter + 1)
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
            <p style={{fontFamily: 'Helvetica, Arial, sans-serif', fontWeight:'bold', fontSize:'30px', color: '#18191a'}}> Users </p>

              <div style={{fontFamily: 'Helvetica, Arial, sans-serif', fontSize:'17px', color: '#18191a', marginBottom:'40px'}}>

                <p >
                {numberUsers}
                </p>

              </div>

            <p style={{fontFamily: 'Helvetica, Arial, sans-serif', fontWeight:'bold', fontSize:'30px', color: '#18191a'}}> Projects </p>

              <div style={{fontFamily: 'Helvetica, Arial, sans-serif', fontSize:'17px', color: '#18191a', marginBottom:'40px'}}>

                <p >
                {numberProjects}
                </p>

              </div>

              </div>
              :
              null}

              {menuItem == 1 ?
              <div>
              <p style={{fontFamily: 'Helvetica, Arial, sans-serif', fontWeight:'bold', fontSize:'30px', color: '#18191a'}}> Feedback </p>
                
                <div style={{fontFamily: 'Helvetica, Arial, sans-serif', fontSize:'17px', color: '#18191a'}}>

                <List
                itemLayout="vertical"
                size="large"
                dataSource={feedback}

                renderItem={item => (
                  <List.Item
                    style={{padding:0}}
                    key={item.id}
                  >

                  <List.Item.Meta

                    description={
                      <div>

                        <div>
                          <h3 style={{marginTop:10, marginBottom:0, fontSize: '20px', cursor:'pointer'}}> <span style={{color:'green', fontWeight:'bold'}}>FID:</span> {item.id} <span style={{color:'green', fontWeight:'bold'}}>Username:</span> {item.username} <span style={{color:'green', fontWeight:'bold'}}>Date:</span> {item.date.slice(0, 10)}</h3>                    
                        </div>

                        <div>
                          <h3 style={{marginTop:10, marginBottom:0, fontSize: '20px', cursor:'pointer'}}>{item.feedback}</h3>
                        </div>
                      </div>}
                  />
                  </List.Item>
                )}
              />
              <Button onClick={nextFeedback}>Next</Button>
              </div>


              </div>
              :
              null}

.
        </Layout>
      </Content>

    </Layout>



  );
  
};

export default AdminPanel;