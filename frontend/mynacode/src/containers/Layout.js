import React from 'react';
import { Layout, Menu, Breadcrumb, Dropdown } from 'antd';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { Checkbox, Radio, Form, Badge, Button  } from 'antd';
import { connect } from 'react-redux';
import * as actions from '../store/actions/actions';
import IP, {IP_image} from "../components/ipConfig";
import protocol from "../components/httpORhttps";
// import io from 'socket.io-client'

const IconText = ({ icon, text }) => (
  <span style={{'marginRight' : 15}}>
    {React.createElement(icon)}
    {text}
  </span>
);

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const CustomLayout = (props) => {
  const navigate = useNavigate()
  let sidebar
  let studentsjobsnav
  const [loginState, setLoginState] = useState("");


  const onLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.setItem('isAuthenticated', 'false') 
    props.authLogout()
    setLoginState('false') //Need to rerender to push to frontpage.
  }

  if (props.isAuthenticated == 'false' && localStorage.getItem('isAuthenticated') == 'false'){
    navigate("/login")
    localStorage.setItem('isAuthenticated', 'dummy') 
  }

  return (
    <div >
    <Layout style={{ backgroundColor:'#383838'}}>

      <Header className="header" style={{backgroundColor:'#383838', position: 'fixed', zIndex: 1, width: '100%'}}>
        <Menu mode="horizontal" style={{backgroundColor:'#383838'}}>

          <Menu.Item style={{marginRight:'10px'}} key="0"><a href={"/frontpage"} ><img height={40} style={{margin:0 ,padding:0}} src={protocol+"://"+IP_image+"/media/mynacode.png"} /></a></Menu.Item>

          { props.isAuthenticated == 'true' || localStorage.getItem('isAuthenticated') == 'true' ? 
              <Menu.Item style={{fontSize:'15px', fontWeight:'bold'}} key="4" onClick={onLogout} ><span style={{color:'#38b6ff'}}>Logout</span></Menu.Item> :
              <Menu.Item style={{fontSize:'15px', fontWeight:'bold'}} key="5"><a href={"/login"} style={{color:'#38b6ff'}} >Login</a></Menu.Item>
          }

          { localStorage.getItem('isAuthenticated') != 'true' ? 

            <Menu.Item style={{fontSize:'15px', fontWeight:'bold'}} key="6"><a href={"/signup"} style={{color:'#38b6ff'}} >Signup</a></Menu.Item>:
            null

          }

  
          { props.isAuthenticated == 'true' || localStorage.getItem('isAuthenticated') == 'true' ? 

            <Menu.Item style={{fontSize:'15px', fontWeight:'bold'}} key="7"><a href={"/profile"} style={{color:'#38b6ff'}} >Account</a></Menu.Item>:
            null

          }

          <Menu.Item style={{fontSize:'15px', fontWeight:'bold'}} key="8"><a href={"/docs"} style={{color:'#38b6ff'}} >Docs</a></Menu.Item>
          

          { (props.isAuthenticated == 'true' || localStorage.getItem('isAuthenticated') == 'true') && props.user_type == 2 ? 

            <Menu.Item style={{fontSize:'15px', fontWeight:'bold'}} key="10"><a href={"/admin_panel"} style={{color:'#38b6ff'}} >Admin</a></Menu.Item>:
            null

          }
          
        </Menu>
      </Header>


      <Layout style={{ backgroundColor:'#383838', maxHeight: '100vh', marginTop:'60px'}}>
        <Content>
        {props.children}
        </Content>
      </Layout>
    </Layout>
    </div>
    );
}

const mapDispatchToProps = dispatch => {
  return {
    authLogout: () => dispatch(actions.authLogout())
  }
}

export default connect(null, mapDispatchToProps)(CustomLayout);
