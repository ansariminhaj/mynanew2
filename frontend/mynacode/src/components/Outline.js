import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import IP from "../components/ipConfig";
import { useNavigate, Link } from 'react-router-dom';
import { Select, Divider, message, Button, Tooltip, Popover, Checkbox, Form, Input, Alert, Modal, Switch, Dropdown, Menu, Upload } from 'antd';
import { PlusCircleOutlined, EditOutlined, AlignLeftOutlined, ApartmentOutlined, FileImageOutlined, CloseOutlined, CheckOutlined, DesktopOutlined, InboxOutlined, FileOutlined, UploadOutlined } from '@ant-design/icons';
import '../components/index.css';
import protocol from "../components/httpORhttps";
import * as actions from '../store/actions/actions';
import { connect } from 'react-redux';
import { Bar, Line, Scatter, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Legend } from 'chart.js/auto'
import { Chart }            from 'react-chartjs-2'

ChartJS.register(ArcElement, Legend);
const { TextArea } = Input;

const layout = {
  labelCol: {
    span: 2,
  },
  wrapperCol: {
    span: 18,
  },
};


const Outline = (props) => {

  const [refresh, setRefresh] = useState(0)
  const navigate = useNavigate()
  const [objectiveNodes, setObjectiveNodes] = useState([])
  const [metricKeys, setMetricKeys] = useState([])
  const [metric, setMetric] = useState("")
  const [metricValues, setMetricValues] = useState([])
  const [runNames, setRunNames] = useState([])
  const [editNotes, setEditNotes] = useState(false)
  const [projectID, setProjectID] = useState(-1)
  const [notesNode, setNotesNode] = useState([])


const handleChange = (value) => {
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
        url: protocol+'://'+IP+'/api/get_outline',
        data: {'project_id': props.project_id, 'key': value},
        headers: {
          'Authorization': "JWT " + localStorage.getItem('access_token'),
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken}} )
      .then(res => { 

          console.log(res.data) 
        
          setMetric(res.data['key'])
          setRunNames(res.data['run_names_list'])
          setMetricValues(res.data['key_values'])

          let metric_keys = []

          for(let j=0; j<res.data['keys_list'].length;j++){
               metric_keys.push({value: res.data['keys_list'][j], label: res.data['keys_list'][j]})   
          } 
                
          setMetricKeys(metric_keys)

        })
    })
    .catch(err => {
      console.log(err.response.data);
      navigate("/login")
    })
};


  const onFinish = (values)  => {
    let form_data = new FormData();

    console.log(values)

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
        url: protocol+'://'+IP+'/api/update_project_notes',
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
        url: protocol+'://'+IP+'/api/get_outline',
        data: {'project_id': props.project_id},
        headers: {
          'Authorization': "JWT " + localStorage.getItem('access_token'),
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken}} )
      .then(res => {            
          let notes_node = []

          console.log(res.data)

          setMetric(res.data['key'])
          setMetricValues(res.data['key_values'])
          setRunNames(res.data['run_names_list'])
          setProjectID(res.data['project_id'])

          let metric_keys = []

          for(let j=0; j<res.data['keys_list'].length;j++){
               metric_keys.push({value: res.data['keys_list'][j], label: res.data['keys_list'][j]})   
          } 

          setMetricKeys(metric_keys) 

          setNotesNode(
            <div style={{padding:'10px', fontWeight: 'bold', color:'white', fontSize:'15px', width: '650px', minHeight: '70px', border: '1px solid black', margin:'20px', backgroundColor: '#34568B', borderRadius: '5px', boxShadow: '3px 4px 5px #888888'}}>
              
              {editNotes == true ?

              <Form
                initialValues={{ remember: true,}}
                {...layout}
                onFinish={onFinish}
                style={{fontFamily: 'Helvetica, Arial, sans-serif'}}>
                  <div style={{fontSize:'19px', display:'flex', justifyContent:'center', color:'white'}}>
                    Project Notes
                  </div>
                  <Form.Item name={"project_notes"} initialValue={res.data['project_notes']}>
                    <TextArea rows={15} placeholder="Notes" style={{minWidth:'600px'}} defaultValue={res.data['project_notes']} />
                  </Form.Item> 

                  <Form.Item>
                    <Button style={{marginRight:10, color:'blue'}}  shape="circle" onClick={()=>setEditNotes(false)}> < CloseOutlined /> </Button> 
                    <Button htmlType="submit" style={{marginRight:10, color:'blue'}} shape="circle" onClick={()=>setEditNotes(false)} > < CheckOutlined /> </Button>
                  </Form.Item>

                </Form>
                :
                <div>
                  <div style={{fontSize:'19px', display:'flex', justifyContent:'center'}}>
                    Project Notes
                  </div>
                  <div onClick={() => setEditNotes(true)} style={{paddingLeft:'50px', paddingRight:'50px', paddingTop:'12px', paddingBottom:'15px', cursor:'pointer', whiteSpace: 'pre-wrap', wordBreak: 'break-all'}}>{res.data['project_notes']}</div>
                </div>
              }

            </div>)

    })
    .catch(err => {
      console.log(err.response.data);
      navigate("/login")
    })
  })}, [props, refresh, editNotes]);

  return (
    <div>

      { props.project_id != -1 ? 
          <div style={{display:'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', flexWrap:'wrap'}}>
            <div style={{color:'#34568B', fontSize:'20px', fontWeight:'bold', paddingTop:'30px'}}>Outline</div>
            <Select
              defaultValue="Select Metric"
              style={{ width: 210,  marginTop:'30px', marginBottom:'15px' }}
              onChange={handleChange}
              options={metricKeys}
            />

            <Line
              data={{
                labels: Array.from(Array(metricValues.length).keys()),
                datasets: [
                  {
                    label: metric,
                    data: metricValues,
                    borderWidth: 2,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',                             
                  }
                ]
              }}
              options={{
                      plugins:{
                        tooltip: {
                           callbacks: {
                              label: function(tooltipItem, data) {
                                 var label = runNames[tooltipItem.dataIndex];
                                 return label + ': ' + tooltipItem.formattedValue 
                              }
                           }
                        }
                      },
                      scales: {
                        x: {
                          type: "linear",
                          offset: false,
                          gridLines: {
                            offsetGridLines: false
                          },
                          title: {
                            display: true,
                            text: "Run"
                          }
                        },
                        y: {
                          title: {
                            display: true,
                            text: metric
                          }
                        }
                      }
                    }}
            />


            {notesNode}

          </div>
          : 
      null}

    </div>
  );
};

export default Outline;
