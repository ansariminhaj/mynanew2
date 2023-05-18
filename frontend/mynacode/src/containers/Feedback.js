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

const { TextArea } = Input;

const layout = {
  labelCol: {
    span: 2,
  },
  wrapperCol: {
    span: 8,
  },
};

const Feedback = (props) => {
  const navigate = useNavigate()
  const [paymentStatus, setPaymentStatus] = useState(-1);
  const [submitSuccessful, setSubmitSuccessful] = useState(0) 

  const onFinish = (values) => {

    var csrftoken = Cookies.get('csrftoken')
    console.log(values)
    let form_data = new FormData();

    for (const [key, value] of Object.entries(values))
      form_data.append(key, value)

    if(values['feedback'].length > 0){
      axios({
        withCredentials: true,
        method: 'post',
        url: protocol+'://'+IP+'/api/token/refresh/',
        data: {'refresh': localStorage.getItem('refresh_token')},
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken}} ) 
      .then(res => {
        console.log(res.data)
        localStorage.setItem('access_token', res.data["access"])
        localStorage.setItem('refresh_token', res.data["refresh"]) 
        axios({
          withCredentials: true,
          method: 'post',
          url: protocol+'://'+IP+'/api/submit_feedback',
          data: form_data,
          headers: {
            'Authorization': "JWT " + localStorage.getItem('access_token'),
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken}} ) 
        .then(res => {
            console.log(res.data)
            setSubmitSuccessful(1)
        })
      })    
    }
  } 


  return (
      
      <div style={{height:'100vh', backgroundColor:'#383838'}}>

      {submitSuccessful == 1 ?
      <h2 style={{fontFamily: 'Helvetica, Arial, sans-serif', margin: '50px 0px 10px 50px', color:'green', fontWeight: 'bold'}}>Feedback Submission Successful!</h2>
      :
      <div>
      <h2 style={{fontFamily: 'Helvetica, Arial, sans-serif', margin: '50px 0px 10px 50px', color:'#87CEFA', fontWeight: 'bold'}}>Feedback</h2>

      <Form
        name="feedback_form"
        {...layout}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        style={{fontFamily: 'Helvetica, Arial, sans-serif', marginLeft: '50px'}}
      >


        <Form.Item name="feedback">
            <TextArea rows={12} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button> 
        </Form.Item>
      </Form>
      </div>}

      </div>
  );
};


export default Feedback;