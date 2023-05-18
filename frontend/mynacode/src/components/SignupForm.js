import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Button, Checkbox, Spin, Radio, Alert, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { UserOutlined, LockOutlined, PhoneOutlined, MailOutlined} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
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

let signup_success = ""

const SignupForm = (props) => {
  const navigate = useNavigate()
  const [successSignup, setSuccessSignup] = useState(-1);

  const onFinish = (values) => {
    var csrftoken = Cookies.get('csrftoken');
    let form_data = new FormData();

    // if (typeof values.payment_proof == "undefined"){
    //   values.payment_proof = "None"
    // }
    // else{
    //   values.payment_proof = values.payment_proof.file
    // }

    for (const [key, value] of Object.entries(values))
      form_data.append(key, value)

    axios({
      withCredentials: true,
      method: 'post',
      url: protocol+'://'+IP+'/api/signup/',
      data: form_data,
      headers: {
        'Content-Type': 'application/json',
        'content-type': 'multipart/form-data',
        'X-CSRFToken': csrftoken}} ) 
    .then(res => {

      if (res.data=="ERROR")
        setSuccessSignup(0)
      else
        setSuccessSignup(1)

    })
    .catch(err => {
      console.log("Error!")
      console.log(err.response.data);
    })
  };

  const radioStyle = {
      height: '30px',
      lineHeight: '30px'
  };

  return (
    <div style={{height:'100vh', backgroundColor:'#383838'}}>

      {successSignup == 0 ?
        <Alert message="Error in the entered information." type="error" showIcon />
        :
        null 
      }

      {successSignup == "1" ?
        <p style={{fontFamily: 'Helvetica, Arial, sans-serif', margin: '50px 0px 10px 50px', color:'#87CEFA', fontSize: '20px'}}>Signup was successful! Please login to continue.</p>
        :
        <div>

        <h2 style={{fontFamily: 'Helvetica, Arial, sans-serif', margin: '50px 0px 10px 50px', color:'#87CEFA', fontWeight: 'bold'}}>Sign Up</h2>

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

          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: 'Please enter your Email!',
              },
            ]}
          >
            <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
          </Form.Item>


          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Sign Up
            </Button> 
          </Form.Item>

        </Form>
        </div>
      }

    </div>
  );
};


export default SignupForm;