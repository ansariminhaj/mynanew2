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

const ForgotPasswordCode = (props) => {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState("") 

  const onFinish = (values) => {

    var csrftoken = Cookies.get('csrftoken')
    axios({
      withCredentials: true,
      method: 'post',
      url: protocol+'://'+IP+'/api/verify_code',
      data: { 
        'email': localStorage.getItem('reset_pw_email'),
        'code': values.code },
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken}} ) 
    .then(res => {
      if(res.data == "ERROR"){
         setErrorMessage(<p style={{color:'red'}}>{'Incorrect Email'}</p>)       
      }
      else{
        let data = res.data
        localStorage.setItem('reset_pw_email', data["email"])
        navigate("/enter_code")
      }
    })
    .catch(err => {
      setErrorMessage(<p style={{color:'red'}}>{'Incorrect Email'}</p>)
    })
  }

  return (
      
      <div>
      {errorMessage}
      <h2 style={{fontFamily: 'Helvetica, Arial, sans-serif', margin: '50px 0px 10px 50px', color:'#87CEFA', fontWeight: 'bold'}}>Enter Code</h2>

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
          name="code"
          rules={[
            {
              required: true,
              message: 'Please enter your Code!',
            },
          ]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Code" />
        </Form.Item>


        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Send Code
          </Button> 
        </Form.Item>
      </Form>

      </div>
  );
};

export default ForgotPasswordCode;