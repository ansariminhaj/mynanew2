import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import IP from "../components/ipConfig";
import { useNavigate, Link } from 'react-router-dom';
import { Divider, message, Button, Tooltip, Popover, Checkbox, Form, Input, Alert, Modal, Switch, Dropdown, Menu, Upload } from 'antd';
import { PlusCircleOutlined, EditOutlined, AlignLeftOutlined, ApartmentOutlined, FileImageOutlined, CloseOutlined, CheckOutlined, DesktopOutlined, InboxOutlined, FileOutlined, UploadOutlined } from '@ant-design/icons';
import '../components/index.css';
import protocol from "../components/httpORhttps";
import * as actions from '../store/actions/actions';
import { connect } from 'react-redux';
import { Bar, Line, Scatter, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Legend } from 'chart.js/auto'
import { Chart }            from 'react-chartjs-2'

ChartJS.register(ArcElement, Legend);


const line_options = {
  scales: {
    x: {
      type: "linear",
      offset: false,
      gridLines: {
        offsetGridLines: false
      },
      title: {
        display: true,
        text: "FPR"
      }
    },
    y: {
      title: {
        display: true,
        text: "TPR"
      }
    }
  }
};



const Outline = (props) => {
  const navigate = useNavigate()
  const [objectiveNodes, setObjectiveNodes] = useState([])


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
          let objective_nodes = []

          for(let j=0; j<res.data.length;j++){
               objective_nodes.push(
               <div style={{padding:'10px', fontWeight: 'bold', color:'white', fontSize:'15px', width: '650px', minHeight: '70px', border: '1px solid black', margin:'20px', backgroundColor: '#34568B', borderRadius: '5px', boxShadow: '3px 4px 5px #888888'}}>                    
                  <div style={{paddingLeft:'50px', paddingRight:'50px', paddingTop:'12px', cursor:'pointer', whiteSpace: 'pre-wrap', wordBreak: 'break-all'}}>{res.data[j]}</div>
                  <Divider style={{backgroundColor:'white'}}/>
                  <div style={{display:'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center'}}>VAL AUC: 0.2813</div>
                </div>
              )   
          } 

          setObjectiveNodes(objective_nodes)  


        })
    })
    .catch(err => {
      console.log(err.response.data);
      navigate("/login")
    })
  }, [props]);








  return (
    <div>

      { props.project_id != -1 ? 
          <div style={{display:'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', flexWrap:'wrap'}}>
            <div style={{color:'#34568B', fontSize:'20px', fontWeight:'bold', paddingTop:'30px'}}>Outline</div>
            <div style={{display:'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', flexWrap:'wrap'}}>
              {objectiveNodes}
            </div>
          </div>
          : 
      null}

    </div>
  );
};

export default Outline;
