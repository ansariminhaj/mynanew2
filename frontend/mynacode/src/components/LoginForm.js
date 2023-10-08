import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Button, Checkbox, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from "react-router-dom";
import { connect } from 'react-redux';
import * as actions from '../store/actions/actions';
import axios from 'axios';
import Cookies from 'js-cookie';
import IP from "../components/ipConfig";
import protocol from "../components/httpORhttps";

const layout = {
  labelCol: {
    span: 2,
  },
  wrapperCol: {
    span: 8,
  },
};

const LoginForm = (props) => {
  const navigate = useNavigate()
  const [paymentStatus, setPaymentStatus] = useState(-1);
  const [errorMessage, setErrorMessage] = useState("") 

  const onFinish = (values) => {

    var csrftoken = Cookies.get('csrftoken')

    console.log("CSRF TOKEN")
    console.log(csrftoken)

    axios({
      withCredentials: true,
      method: 'post',
      url: protocol+'://'+IP+'/api/token/',
      data: { 
        'username':values.username, 
        'password':values.password },
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken}} ) 
    .then(res => {
      if(res.data == "ERROR")
         setErrorMessage(<p style={{color:'red'}}>{'Incorrect Username or Password'}</p>)       
      else{

        console.log(res.data)
        localStorage.setItem('access_token', res.data["access"])
        localStorage.setItem('refresh_token', res.data["refresh"]) 
        localStorage.setItem('isAuthenticated', 'true') 

        console.log("CSRF TOKEN")
        console.log(csrftoken)

        axios({
          withCredentials: true,
          method: 'post',
          url: protocol+'://'+IP+'/api/user_info',
          headers: {
            'Authorization': "JWT " + localStorage.getItem('access_token'),
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken}} ) 
        .then(res => {
            console.log(res.data)
            props.authSuccess(res.data['user_type'], res.data['id'], res.data['name'])
        })
        .catch(err => {
          console.log("Error!")
          console.log(err.response.data);
        })
      }
    })
    .catch(err => {
      setErrorMessage(<p style={{color:'red'}}>{'Incorrect Username or Password'}</p>)
    })

  } 

  if (props.isAuthenticated == "error"){
    setErrorMessage(<p style={{color:'red'}}>{'Incorrect Username or Password'}</p>)
  }

  if (props.isAuthenticated == "true"){
    navigate("/")
  } 

  return (
      
      <div style={{height:'100vh', backgroundColor:'#383838'}}>
      {errorMessage}
      <h2 style={{fontFamily: 'Helvetica, Arial, sans-serif', margin: '50px 0px 10px 50px', color:'#87CEFA', fontWeight: 'bold'}}>Login</h2>

      <Form
        name="normal_login"
        className="login-form"
        {...layout}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        style={{fontFamily: 'Helvetica, Arial, sans-serif', marginLeft: '50px'}}
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: 'Please enter your Username!',
            },
          ]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Please enter your Password!',
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <Link to= {{ pathname:"/enter_email" }}>
            Forgot password
          </Link>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button> 
        </Form.Item>
      </Form>

      </div>
  );
};

const mapStateToProps = state => {
  return {
    loading: state.loading,
    isAuthenticated: state.isAuthenticated,
    user_type: state["user_type"]
  }
}

const mapDispatchToProps = dispatch => {
  return {
    authLogout: () => dispatch(actions.authLogout()),
    authSuccess: (user_type, id, name) => dispatch(actions.authSuccess(user_type, id, name))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);