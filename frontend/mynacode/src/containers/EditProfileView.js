import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import Cookies from 'js-cookie';
import LoginForm from '../components/LoginForm';
import * as actions from '../store/actions/actions';
import { MinusCircleOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { Form, Input, Tooltip, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, Upload, Space, Tag } from 'antd';
import { UploadOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import IP from "../components/ipConfig";
import protocol from "../components/httpORhttps";

const { Option } = Select;
const layout = {
  labelCol: {
    span: 2,
  },
  wrapperCol: {
    span: 10,
  },
};

const EditProfileView = (props) => {
  const navigate = useNavigate()

  let [universities, setUniversities] = useState([]);
  let [degrees, setDegrees] = useState([]);
  let [programs, setPrograms] = useState([]);
  let [fileList, setFileList] = useState([]);
  const [value, onChange] = useState(new Date());
  let [countries, setCountries] = useState([]);
  let [provinces, setProvinces] = useState([]);
  let [cities, setCities] = useState([]);

  let data=props.location.state
  
  const [form] = Form.useForm();
  const { Option } = Select;

  if (props.update_error == "none"){
    navigate("/profile")
    props.onReset()
  }


  const onFinish = (values) => {
      console.log(values)
      let form_data = new FormData();
      
      if (typeof values.image == "undefined"){
        values.image = "None"
      }
      else{
        values.image = values.image.file
      }

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
          url: protocol+'://'+IP+'/api/profile_update',
          data: form_data,
          headers: {
            'Authorization': "JWT " + localStorage.getItem('access_token'),
            'content-type': 'multipart/form-data',
            'X-CSRFToken': csrftoken}} )
        .then(res => {
           if(res.data == 'OK')
              navigate("/profile")
        })
        .catch(err => {
          console.log(err.response.data);
        })
      })     
  };


  useEffect(() => {
    var csrftoken = Cookies.get('csrftoken');
    const job_id = props.match.params.job_id;
    const comment_body = props.location.state
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
        url: protocol+'://'+IP+'/api/edit_profile',
        headers: {
          'Authorization': "JWT " + localStorage.getItem('access_token'),
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken}} )
      .then(res => {
            form.setFieldsValue({
              name:res.data[0].name,
              phone:res.data[0].phone,
              email:res.data[0].email,
              prefix: '86',
              degree: res.data[1].degree,
              year: res.data[1].year,
              program: res.data[1].program,
              university: res.data[1].university,
              country: res.data[1].country,
              province: res.data[1].province,
              city: res.data[1].city
            })}
            )
    })
    .catch(err => {
      console.log(err.response.data);
      navigate("/login")
    })}, [props]);


  return (
    <Form
      form={form}
      name="register"
      {...layout}
      onFinish={onFinish}

      scrollToFirstError
    >

      <h3 style={{marginTop:5, marginBottom:0}}>Name</h3>
      <Form.Item
        name="name"
        rules={[
          {
            required: true,
            message: 'Please input your Username!',
          },
        ]}
      >
        <Input/>
      </Form.Item>

      <h3 style={{marginTop:5, marginBottom:0}}>Email</h3>
      <Form.Item
        name="email"
        rules={[
          {
            type: 'email',
            message: 'The input is not valid E-mail!',
          },
          {
            required: true,
            message: 'Please input your E-mail!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <h3 style={{marginTop:5, marginBottom:0}}>Phone</h3>
      <Form.Item
        name="phone"
        rules={[
          {
            required: true,
            message: 'Please input your phone number!',
          },
        ]}
      >
        <Input
          style={{
            width: '100%',
          }}
        />
      </Form.Item>




      <h3 style={{marginTop:5, marginBottom:0}}>Degree</h3>
      <Form.Item
        name="degree"
      >
      <Select
        style={{ width: 200 }}
        placeholder="Select degree"
        options={degrees}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
      </Select>
      </Form.Item>

      <h3 style={{marginTop:5, marginBottom:0}}>Program</h3>
      <Form.Item
        name="program"
      >
      <Select
        style={{ width: 200 }}
        placeholder="Select program"
        options={programs}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
      </Select>
      </Form.Item>

      <h3 style={{marginTop:5, marginBottom:0}}>Year</h3>
      <Form.Item
        name="year"
      >
        <Input style={{ width: 200 }} />
      </Form.Item>

      <h3 style={{marginTop:5, marginBottom:0}}>University</h3>
      <Form.Item
        name="university"
      >
      <Select
        style={{ width: 200 }}
        placeholder="Select university"
        options={universities}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
      </Select>
      </Form.Item>

{/*      <h3 style={{marginTop:5, marginBottom:0}}>Lives in</h3>
      <Form.Item
        name="from_country"
      >
        <Input />
      </Form.Item>*/}

      <h3 style={{marginTop:5, marginBottom:0}}>Profile Picture</h3>
      <Form.Item
        name="image"    
      >
        <Upload name="logo" listType="picture" beforeUpload={() => false}>
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary"><Link to= {{ pathname:"/profile" }} >Cancel</Link></Button> <Button type="primary" htmlType="submit">Update</Button>
      </Form.Item>

    </Form>
  );
};


export default EditProfileView