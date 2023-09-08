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
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Legend);

const { TextArea } = Input;
const { Dragger } = Upload;

const layout = {
  labelCol: {
    span: 2,
  },
  wrapperCol: {
    span: 18,
  },
};

const scatter_options = {
  scales: {
    x: {
      title: {
        display: true,
        text: "Data Count"
      }
    },
    y: {
      title: {
        display: true,
        text: "Probability"
      },
      beginAtZero: true,
    },
  },
};


const bar_options = {
  scales: {
    x: {
      type: "linear",
      offset: false,
      gridLines: {
        offsetGridLines: false
      },
      title: {
        display: true,
        text: "Points"
      }
    },

    y: {
      title: {
        display: true,
        text: "Probability"
      }
    }
  }
};

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



const CreateGraph = (props) => {
  const navigate = useNavigate()
  const [nodeBorder, setNodeBorder] = useState([])
  const [refresh, setRefresh] = useState(0)
  const [isCreateNodeModalOpen, setIsCreateNodeModalOpen] = useState(false);
  const [isDeleteNodeModalOpen, setIsDeleteNodeModalOpen] = useState(false);
  const [showUploadProgress, setshowUploadProgress] = useState(false)
  const [showFileUploadProgress, setshowFileUploadProgress] = useState(false)
  const [files, setFiles] = useState()
  const [images, setImages] = useState()

  const [variableNodes, setVariableNodes] = useState([])
  const [csvNodes, setCSVNodes] = useState([])
  const [datasetNodes, setDatasetNodes] = useState([])
  const [methodNodes, setMethodNodes] = useState([])
  const [resultNodes, setResultNodes] = useState([])
  const [objectiveNodes, setObjectiveNodes] = useState([])
  const [nodeViewModalDict, setNodeViewModalDict] = useState({})
  const [editNodeViewModalDict, setEditNodeViewModalDict] = useState({})
  const [editNodeID, setEditNodeID] = useState(-1);
  const keyValueID = useRef(-1);

  const [systemInfo, setSystemInfo] = useState([]);
  const [libraries, setLibraries] = useState([]);
  const [filepaths, setFilepaths] = useState([]);
  const [node_description, setNode_description] = useState("");

  const [form] = Form.useForm();

  const colors = ['#34568B', '#FF6F61', '#6B5B95', '#75675E', '#88B04B', '#F7CAC9', '#92A8D1', '#955251', '#324F17', '#EEAD0E',
  '#B565A7', '#009B77', '#DD4124', '#BAAF07', '#D65076', '#45B8AC', '#EFC050', '#777733', '#5B5EA6', '#9B2335', '#DFCFBE', '#55B4B0',
  '#E15D44', '#5C3317', '#8B8682','#9CCB19']




  const onFinish = (values)  => {
    let form_data = new FormData();

    console.log(values)

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
        url: protocol+'://'+IP+'/api/update_node_info',
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


  const onFinishKeyValue = (values)  => {
    let form_data = new FormData();

    for (const [key, value] of Object.entries(values))
      form_data.append(key, value)

    form_data.append('node_id', keyValueID.current)

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
        url: protocol+'://'+IP+'/api/add_key_value',
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


 const imageUpload = (file) => {
    let data = {}

    if (file) {
        data = {'run_id': props.run_id, 'image': file}
    } 
    else {
        return
    }


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
        url: protocol+'://'+IP+'/api/upload_image',
        data: data,
        headers: {
          'Authorization': "JWT " + localStorage.getItem('access_token'),
          'Content-Type': 'application/json',
          'content-type': 'multipart/form-data',
          'X-CSRFToken': csrftoken}} )
      .then(res => {
        setshowUploadProgress(true)
        setRefresh((prevValue) => prevValue + 1) 
      })
    })
    .catch(err => {
      console.log(err.response.data);
      navigate("/login")
    })

  };

  const fileUpload = (file)  => {
    let data = {}

    if (file) {
        data = {'run_id': props.run_id, 'file': file}
    } 
    else {
        return
    }

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
        url: protocol+'://'+IP+'/api/upload_file',
        data: data,
        headers: {
          'Authorization': "JWT " + localStorage.getItem('access_token'),
          'content-type': 'multipart/form-data',
          'X-CSRFToken': csrftoken}} )
      .then(res => { 
          setshowFileUploadProgress(true)
          setRefresh((prevValue) => prevValue + 1)
        })
    })
    .catch(err => {
      console.log(err.response.data);
      navigate("/login")
    })
  }


 const dummyRequest = () => {
    console.log('mynacode')
  };

  const editNode = (id, desc, name, summary) => {
    setEditNodeViewModalDict(prevState => {
      return {
        ...prevState,
        [id]: true
      }
    });
    setEditNodeID(id)
    form.setFieldsValue({node_description: desc, node_id: id, node_name: name, node_summary: summary})
    setRefresh((prevValue) => prevValue + 1) 
  };

  const closeEditNode = (id) => {
    setEditNodeViewModalDict(prevState => {
      return {
        ...prevState,
        [id]: false
      }
    });
    setRefresh((prevValue) => prevValue + 1) 
  }

  const addKeyValue = (id) => {
    keyValueID.current = id
  }


  const DeleteNode = (id) => {
    closeEditNode(id)
    setIsDeleteNodeModalOpen(true)
    setEditNodeID(id)
    setRefresh((prevValue) => prevValue + 1) 
  };


  const handleDeleteNodeOk = () => {
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
          url: protocol+'://'+IP+'/api/node_delete',
          data: {'node_id': editNodeID},
          headers: {
            'Authorization': "JWT " + localStorage.getItem('access_token'),
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken}} )
        .then(res => {
           if(res.data == 'OK')
              setIsDeleteNodeModalOpen(false)
              setRefresh((prevValue) => prevValue + 1) 
        })
        .catch(err => {
          console.log(err.response.data);
        })
      })
  };


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
        url: protocol+'://'+IP+'/api/get_nodes',
        data: {'run_id': props.run_id},
        headers: {
          'Authorization': "JWT " + localStorage.getItem('access_token'),
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken}} )
      .then(res => { 

        console.log(res.data)

          let variable_nodes = []
          let csv_nodes = []
          let dataset_nodes = []
          let result_nodes = []
          let method_nodes = []
          let objective_nodes = []
          let system_info_list = []
          let library_list = []
          let zero_freq 
          let zero_bins 
          let one_freq
          let one_bins
          let zero_prob
          let one_prob
          let fpr 
          let tpr 
          let length_one
          let length_zero
          let threshold
          let metric_values
          let metric_name
          let metric_index
          let train_count_label = []
          let val_count_label = []
          let test_count_label = []
          let train_count
          let val_count 
          let test_count
          let mid_zero_bins
          let mid_one_bins
          let test_auc

          let node_view_dict = {}
          let edit_node_view_dict = {}


          if (res.data['installed_packages']){
              let libraries = JSON.parse(res.data['installed_packages'].replace(/'/g, '"'))
              for(let i = 0; i<libraries.length;i++){
                library_list.push( 
                       {key: i,
                        label: (
                            <div>{libraries[i]}</div>
                        ),
                      })
                }

              setLibraries(<Menu items={library_list} style={{overflowY: 'auto', height:'300px'}}/>)
          }

          

          if (res.data['system_info']){
            let systeminfo = JSON.parse(res.data['system_info'].replace(/'/g, '"'))
            for(let k = 0; k<systeminfo.length;k++){
              {systeminfo[k].includes('  GPU  ') || systeminfo[k].includes('  CPU  ') || systeminfo[k].includes('  MEMORY  ')
              ?
              system_info_list.push( 
                     {key: k,
                      label: (
                          <div style={{color: 'white', fontSize:'15px'}}>{systeminfo[k]}</div>
                      ),
                      style:{backgroundColor: 'blue'}
                    })
              :
              system_info_list.push( 
                   {key: k,
                    label: (
                        <div>{systeminfo[k]}</div>
                    ),
                  })           
              }
            }

            setSystemInfo(<Menu items={system_info_list} style={{overflowY: 'auto', height:'300px'}}/>)           
          }


          if (res.data['files_list']){
            let files_list = []
            for(var k=0;k<res.data['files_list'].length;k++){
              files_list.push(         
                  {key: k,
                  label: (
                      <div><a href={res.data['files_list'][k]}>{res.data['files_list'][k].split("/").slice(-1)}</a></div>
                  ),
                })
            }
            setFiles(<Menu items={files_list} style={{overflowY: 'auto', height:'300px'}}/>)
          }

          if (res.data['images_list']){
            let images_list = []
            for(var k=0;k<res.data['images_list'].length;k++){
              images_list.push(         
                  {key: k,
                  label: (
                      <div><img width={500} src={res.data['images_list'][k]} /></div>
                  ),
                })
            }
            setImages(<Menu items={images_list} style={{overflowY: 'auto', height:'600px'}}/>)
          }

          
          if (res.data['nodes']){
            for(var i=0;i<res.data['nodes'].length;i++){

              let index = res.data['nodes'][i]['id']
              let desc = JSON.stringify(res.data['nodes'][i]['description'])
              let name = res.data['nodes'][i]['name']
              let summary = JSON.stringify(res.data['nodes'][i]['node_summary']).slice(1, -1)

              let rows = []
              let cmatrix 
              let count = 0
              let color = 'white'

              if(res.data['nodes'][i]['node_type'] == 0  && res.data['nodes'][i]['csv_node'] == 0 && res.data['nodes'][i]['dataset_node'] == 0){
                for(const [key, value] of Object.entries(res.data['nodes'][i]['description'])){
                  count+=1
                  if(count%2==0)
                    color = '#E0E0E0'
                  else
                    color = '#AECBB7'
                  rows.push(<div style={{fontSize:'16px', width:'100%', backgroundColor: color, display:'flex', flexDirection:'row', whiteSpace: 'pre-wrap', wordBreak: 'break-all'}}><div style={{paddingLeft: '90px', width: '460px'}}>{String(key)}</div><div style={{width: '180px'}}>{JSON.stringify(value).replace(/^"(.*)"$/, '$1')}</div></div>)
                }
              }
              else if (res.data['nodes'][i]['node_type'] == 0 && res.data['nodes'][i]['csv_node'] == 1){
                if (res.data['nodes'][i]['description']){
                  let parsed_columns = JSON.parse(res.data['nodes'][i]['description']['columns list'].replace(/'/g, '"'))
                  let parsed_null = JSON.parse(res.data['nodes'][i]['description']['isnull list'].replace(/'/g, '"'))
                  let parsed_dtypes = JSON.parse(res.data['nodes'][i]['description']['dtypes list'].replace(/'/g, '"'))
                  let parsed_unique = JSON.parse(res.data['nodes'][i]['description']['isunique list'].replace(/'/g, '"'))
                  let size = res.data['nodes'][i]['description']['size']
                  let shape = res.data['nodes'][i]['description']['shape']

                  rows.push(<div> Size (in KB): {size}</div>)
                  rows.push(<div> Shape: {shape}</div>)

                  rows.push(<div style={{fontSize:'18px', color:'white', marginTop: '10px', width:'100%', backgroundColor: '#38b6ff', display:'flex', flexDirection:'row', paddingBottom:'10px', paddingTop:'10px'}}><div style={{paddingLeft: '20px', width:'225px'}}>Column</div><div style={{width:'134px'}}>Unique</div><div style={{width:'130px'}}>Null</div><div style={{width:'134px'}}>Datatype</div></div>)

                  for(let i=0; i<parsed_columns.length; i++){
                    count+=1
                    if(count%2==0)
                      color = '#E0E0E0'
                    else
                      color ='#89CFF0'
                    rows.push(<div style={{fontSize:'16px', width:'100%', backgroundColor: color, display:'flex', flexDirection:'row'}}><div style={{paddingLeft: '20px', width:'234px'}}>{parsed_columns[i]}</div><div style={{width:'134px'}}>{parsed_unique[i]}</div><div style={{width:'134px'}}>{parsed_null[i]}</div><div style={{width:'134px'}}>{parsed_dtypes[i]}</div></div>)
                   
                   }
                  }
              }
              else if (res.data['nodes'][i]['node_type'] == 0 && res.data['nodes'][i]['dataset_node'] == 1){
                if (res.data['nodes'][i]['description']){
                if('train_count' in res.data['nodes'][i]['description']){
                  train_count = res.data['nodes'][i]['description']['train_count']
                  if('label_names_train' in res.data['nodes'][i]['description']){
                    train_count_label = res.data['nodes'][i]['description']['label_names_train']
                    for (var j = 0; j < train_count_label.length; j++) {
                      train_count_label[j] = String(train_count_label[j]);
                    }
                  }
                  else{
                    for (var j = 0; j < train_count.length; j++) {
                      train_count_label.push(String(j));
                    }
                  }
                }

                if('val_count' in res.data['nodes'][i]['description']){
                  val_count = res.data['nodes'][i]['description']['val_count']
                  if('label_names_val' in res.data['nodes'][i]['description']){
                    val_count_label = res.data['nodes'][i]['description']['label_names_val']
                    for (var j = 0; j < val_count_label.length; j++) {
                      val_count_label[j] = String(val_count_label[j]);
                    }
                  }
                  else{
                    for (var j = 0; j < val_count.length; j++) {
                      val_count_label.push(String(j));
                    }
                  }
                }

                if('test_count' in res.data['nodes'][i]['description']){
                  test_count = res.data['nodes'][i]['description']['test_count']
                  if('label_names_test' in res.data['nodes'][i]['description']){
                    test_count_label = res.data['nodes'][i]['description']['label_names_test'] 
                    for (var j = 0; j < test_count_label.length; j++) {
                      test_count_label[j] = String(test_count_label[j]);
                    }
                  }
                  else{                 
                    for (var j = 0; j < test_count.length; j++) {
                      test_count_label.push(String(j));
                    }
                  }
                }          
             
                  for(const [key, value] of Object.entries(res.data['nodes'][i]['description'])){
                    if (key == 'train_count' || key == 'val_count' || key == 'test_count' || key == 'label_names_train' || key == 'label_names_val' || key == 'label_names_test' || key == 'prev_saved_data')
                      continue

                    count+=1
                    if(count%2==0)
                      color = '#E0E0E0'
                    else
                      color = '#F08080'
                    rows.push(<div style={{fontSize:'16px', width:'100%', backgroundColor: color, display:'flex', flexDirection:'row', whiteSpace: 'pre-wrap', wordBreak: 'break-all'}}><div style={{paddingLeft: '90px', width: '460px'}}>{String(key)}</div><div style={{width: '180px'}}>{JSON.stringify(value).replace(/^"(.*)"$/, '$1')}</div></div>)
                  }          
                }
              }
              else if (res.data['nodes'][i]['node_type'] == 2){

                if (res.data['nodes'][i]['description']){
                  try{
                    let c_matrix = res.data['nodes'][i]['description']['c_matrix']

                    if (typeof c_matrix == 'undefined')
                      cmatrix=undefined
                    else{
                      cmatrix=(
                          <div>
                          Test Confusion Matrix
                          <table border="1">
                            <tr>
                              <td style={{padding:20}}>TP: {c_matrix[3]}</td>
                              <td style={{padding:20}}>FP: {c_matrix[1]}</td>
                            </tr>
                            <tr>
                              <td style={{padding:20}}>FN: {c_matrix[2]}</td>
                              <td style={{padding:20}}>TN: {c_matrix[0]}</td>
                            </tr>
                          </table>
                          </div>
                      )
                    }
                  }
                  catch(err){
                    console.log(err)
                  }

                  if('metric_values' in res.data['nodes'][i]['description'])
                    metric_values = res.data['nodes'][i]['description']['metric_values']
                    metric_name = res.data['nodes'][i]['description']['metric_name']
                    metric_index = res.data['nodes'][i]['description']['best_metric_index']

                  try {
                    fpr = res.data['nodes'][i]['description']['fpr']
                    tpr = res.data['nodes'][i]['description']['tpr']
                    zero_prob = res.data['nodes'][i]['description']['zero_prob']
                    one_prob = res.data['nodes'][i]['description']['one_prob']
                    threshold = res.data['nodes'][i]['description']['threshold']
                    zero_bins = res.data['nodes'][i]['description']['hist_zero_bins']
                    one_bins = res.data['nodes'][i]['description']['hist_one_bins']
                    zero_freq = res.data['nodes'][i]['description']['hist_zero_freq']
                    one_freq = res.data['nodes'][i]['description']['hist_one_freq'] 
                    test_auc = res.data['nodes'][i]['description']['test_auc'] 

                    const consecutiveAverage = arr => {
                       return arr.map((el, ind, array) => {
                          return ((el + (array[ind-1] || 0)) / (1 + !!ind));
                       });
                    };

                    mid_zero_bins = consecutiveAverage(zero_bins).slice(1)
                    mid_one_bins = consecutiveAverage(one_bins).slice(1)


                    length_one = Math.max(...one_freq)
                    length_zero = Math.max(...zero_freq)


                  }
                  catch(err){
                    console.log(err)
                  }

                  for(const [key, value] of Object.entries(res.data['nodes'][i]['description'])){
                    if (key == 'freq' || key == 'bins' || key == 'fpr' || key == 'tpr' || key == 'c_matrix' || key == 'zero_prob' || key == 'one_prob' || key == 'metric_values' || key == 'best_metric_index' || key == 'hist_one_bins' || key == 'hist_zero_bins' || key == 'hist_one_freq' || key == 'hist_zero_freq')
                      continue

                    count+=1
                    if(count%2==0)
                      color = 'white'
                    else
                      color = '#E8E8E8'
                    rows.push(<div style={{fontSize:'16px', width:'100%', backgroundColor: color, display:'flex', flexDirection:'row', whiteSpace: 'pre-wrap', wordBreak: 'break-all'}}><div style={{paddingLeft: '90px', width: '460px'}}>{String(key)}</div><div style={{width: '180px'}}>{JSON.stringify(value).replace(/^"(.*)"$/, '$1')}</div></div>)
                  }   
                }
              }


              if (res.data['nodes'][i]['node_type'] == 0){
                if (res.data['nodes'][i]['dataset_node'] == 1){

                    /// DATASETS ///

                    dataset_nodes.push( 
                      <div>
                        <div style={{color:'black', minWidth: '650px', minHeight: '100px', border: '1px solid black', display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', margin:'20px', borderRadius: '5px', boxShadow: '3px 4px 5px #888888'}}>
                            < EditOutlined onClick={() => editNode(index, desc, name, summary)}  style={{paddingTop:'5px', cursor:'pointer', marginLeft:'auto', marginRight:'10px'}} />
                            <div style={{paddingBottom: '10px', paddingTop: '10px', fontWeight: 'bold'}}>
                              {res.data['nodes'][i]['node_summary']}
                            </div>

                              <div style={{display:'flex', marginBottom:'15px'}}>
                                {typeof train_count != 'undefined' ?
                                <div style={{width:'250px'}}>
                                <Pie data = {{
                                  labels: train_count_label,
                                  datasets: [
                                    {
                                      data: train_count,
                                      backgroundColor: [
                                        'rgba(255, 99, 132, 0.2)',
                                        'rgba(54, 162, 235, 0.2)',
                                        'rgba(255, 206, 86, 0.2)',
                                        'rgba(75, 192, 192, 0.2)',
                                        'rgba(153, 102, 255, 0.2)',
                                        'rgba(255, 159, 64, 0.2)',
                                      ],
                                      borderColor: [
                                        'rgba(255, 99, 132, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(255, 206, 86, 1)',
                                        'rgba(75, 192, 192, 1)',
                                        'rgba(153, 102, 255, 1)',
                                        'rgba(255, 159, 64, 1)',
                                      ],
                                      borderWidth: 1,
                                    },
                                  ]}}

                                  plugins = {[ChartDataLabels]}

                                  options = {{
                                      plugins: {
                                          title: {
                                              display: true,
                                              text: 'TRAIN LABELS COUNT'
                                          },
                                          legend: {
                                            display: false
                                          }                                      
                                      }}
                                  } /></div> : null}


                                {typeof val_count != 'undefined' ?
                                <div style={{width:'250px'}}>
                                <Pie data = {{
                                  labels: val_count_label,
                                  datasets: [
                                    {
                                      data: val_count,
                                      backgroundColor: [
                                        'rgba(255, 99, 132, 0.2)',
                                        'rgba(54, 162, 235, 0.2)',
                                        'rgba(255, 206, 86, 0.2)',
                                        'rgba(75, 192, 192, 0.2)',
                                        'rgba(153, 102, 255, 0.2)',
                                        'rgba(255, 159, 64, 0.2)',
                                      ],
                                      borderColor: [
                                        'rgba(255, 99, 132, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(255, 206, 86, 1)',
                                        'rgba(75, 192, 192, 1)',
                                        'rgba(153, 102, 255, 1)',
                                        'rgba(255, 159, 64, 1)',
                                      ],
                                      borderWidth: 1,
                                    },
                                  ]}} 

                                  plugins = {[ChartDataLabels]}

                                  options = {{
                                      plugins: {
                                          title: {
                                              display: true,
                                              text: 'VAL LABELS COUNT'
                                          },
                                          legend: {
                                            display: false
                                          }                                         
                                      }}
                                  } /></div> : null}


                                {typeof test_count != 'undefined' ?
                                <div style={{width:'250px'}}>
                                <Pie data = {{
                                  labels: test_count_label,
                                  datasets: [
                                    {
                                      data: test_count,
                                      backgroundColor: [
                                        'rgba(255, 99, 132, 0.2)',
                                        'rgba(54, 162, 235, 0.2)',
                                        'rgba(255, 206, 86, 0.2)',
                                        'rgba(75, 192, 192, 0.2)',
                                        'rgba(153, 102, 255, 0.2)',
                                        'rgba(255, 159, 64, 0.2)',
                                      ],
                                      borderColor: [
                                        'rgba(255, 99, 132, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(255, 206, 86, 1)',
                                        'rgba(75, 192, 192, 1)',
                                        'rgba(153, 102, 255, 1)',
                                        'rgba(255, 159, 64, 1)',
                                      ],
                                      borderWidth: 1,
                                      
                                    },
                                  ]}} 

                                  plugins = {[ChartDataLabels]}

                                  options = {{

                                      plugins: {
                                          title: {
                                              display: true,
                                              text: 'TEST LABELS COUNT'
                                          },
                                          legend: {
                                            display: false
                                          }
                                      }}
                                  } />
                                  </div>: null}

                            </div>

                            <div style={{display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', marginBottom:'15px'}}>
                              {rows}
                          <Form
                            initialValues={{ remember: true,}}
                            {...layout}
                            onFinish={onFinishKeyValue}
                            style={{fontFamily: 'Helvetica, Arial, sans-serif', marginTop:'12px'}}>

                              <div style={{display:'flex', justifyContent:'center'}}>                                
                                <Form.Item name={"key"}> 
                                  <Input placeholder="Key" style={{width:'165px', marginRight:'100px'}}/> 
                                </Form.Item> 

                                
                                <Form.Item name={"value"}> 
                                  <Input placeholder="Value" style={{width:'165px'}} /> 
                                </Form.Item> 
                              </div>

                              <div style={{display:'flex', justifyContent:'center'}}>
                              <Form.Item>
                                <Button htmlType="submit" style={{color:'blue'}} shape="circle" onClick={()=>addKeyValue(index)} > < CheckOutlined /> </Button>
                              </Form.Item>
                              </div>

                            </Form>
                            </div>
                        </div>

                        <Modal visible={editNodeViewModalDict[res.data['nodes'][i]['id']]} closable={false} footer={null}>

                          <Form
                            form={form}
                            {...layout}
                            onFinish={onFinish}
                            style={{fontFamily: 'Helvetica, Arial, sans-serif'}}>
                              <Form.Item name={'node_id'} initialValue={res.data['nodes'][i]['id']} hidden={true}></Form.Item>

                              Name
                              <Form.Item name={"node_name"} initialValue={res.data['nodes'][i]['name']}> 
                                <Input placeholder="Node Name" style={{width:'165px'}} defaultValue={res.data['nodes'][i]['name']} /> 
                              </Form.Item> 

                              Description 
                              <Form.Item name={"node_summary"} initialValue={JSON.stringify(res.data['nodes'][i]['node_summary']).slice(1, -1)}>
                                <TextArea rows={2} showCount placeholder="Summary" style={{width:'450px'}} defaultValue={JSON.stringify(res.data['nodes'][i]['node_summary']).slice(1, -1)} />
                              </Form.Item> 

                              <Form.Item>
                                <Button style={{marginRight:10, color:'blue'}}  shape="circle" onClick={()=>closeEditNode(index)}> < CloseOutlined /> </Button> 
                                    <Button htmlType="submit" style={{marginRight:10, color:'blue'}} shape="circle" onClick={()=>closeEditNode(index)} > < CheckOutlined /> </Button>
                              </Form.Item>
                              <div style={{color:'red', marginBottom:'15px'}}><u style={{cursor:'pointer'}} onClick={()=>DeleteNode(index)}>Delete Node</u></div>

                            </Form>

                        </Modal>
                      </div>
                  )

                }

              else if(res.data['nodes'][i]['csv_node'] == 1){

                    /// CSV ///

                    csv_nodes.push(
                      <div>
                        <div style={{ width: '650px', minHeight: '100px', border: '1px solid black', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin:'20px', borderRadius: '5px', boxShadow: '3px 4px 5px #888888'}}>
                            <div onClick={() => editNode(index)} style={{cursor:'pointer', marginTop:'15px', display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', marginBottom:'15px'}}>
                              {rows.length == 0 ?
                              <div>Add a CSV file from your code</div>
                              :
                              rows}
                            </div>

                            <Modal visible={editNodeViewModalDict[res.data['nodes'][i]['id']]} closable={false} footer={null}>
                            <div style={{color:'red', marginBottom:'15px'}}><u style={{cursor:'pointer'}} onClick={()=>DeleteNode(index)}>Delete Node</u></div>
                            <Button htmlType="submit" style={{marginRight:10, color:'blue'}} shape="circle" onClick={()=>closeEditNode(index)} > < CloseOutlined /> </Button> 
                            </Modal>
                        </div>
                      </div>
                  )
              }
 
            }
            else if(res.data['nodes'][i]['node_type'] == 1){


               method_nodes.push(
                  <div style={{padding:'10px', fontWeight: 'bold', color:'white', fontSize:'15px', width: '650px', minHeight: '70px', border: '1px solid black', margin:'20px', backgroundColor: '#34568B', borderRadius: '5px', boxShadow: '3px 4px 5px #888888'}}>
                    
                    {editNodeViewModalDict[res.data['nodes'][i]['id']] == true ?

                    <Form
                      initialValues={{ remember: true,}}
                      {...layout}
                      onFinish={onFinish}
                      style={{fontFamily: 'Helvetica, Arial, sans-serif'}}>
                        <Form.Item name={'node_id'} initialValue={res.data['nodes'][i]['id']} hidden={true}></Form.Item>

                        <Form.Item name={"node_summary"} initialValue={res.data['nodes'][i]['node_summary']}>
                          <TextArea rows={15} placeholder="Description" style={{minWidth:'600px'}} defaultValue={res.data['nodes'][i]['node_summary']} />
                        </Form.Item> 

                        <Form.Item>
                          <Button style={{marginRight:10, color:'blue'}}  shape="circle" onClick={()=>closeEditNode(index)}> < CloseOutlined /> </Button> 
                          <Button htmlType="submit" style={{marginRight:10, color:'blue'}} shape="circle" onClick={()=>closeEditNode(index)} > < CheckOutlined /> </Button>
                        </Form.Item>
                        {/*<div style={{color:'red', marginBottom:'15px'}}><u style={{cursor:'pointer'}} onClick={()=>DeleteNode(index)}>Delete Node </u></div>*/}

                      </Form>
                      :
                      <div onClick={() => editNode(index)} style={{paddingLeft:'50px', paddingRight:'50px', paddingTop:'12px', paddingBottom:'12px', cursor:'pointer', whiteSpace: 'pre-wrap', wordBreak: 'break-all'}}>{res.data['nodes'][i]['description']}</div>
                    }

                  </div>

              )               
            }
            else if(res.data['nodes'][i]['node_type'] == 5){


               objective_nodes.push(
               <div style={{padding:'10px', fontWeight: 'bold', color:'white', fontSize:'15px', width: '650px', minHeight: '70px', border: '1px solid black', margin:'20px', backgroundColor: '#34568B', borderRadius: '5px', boxShadow: '3px 4px 5px #888888'}}>
                    
                    {editNodeViewModalDict[res.data['nodes'][i]['id']] == true ?

                    <Form
                      initialValues={{ remember: true,}}
                      {...layout}
                      onFinish={onFinish}
                      style={{fontFamily: 'Helvetica, Arial, sans-serif'}}>
                        <Form.Item name={'node_id'} initialValue={res.data['nodes'][i]['id']} hidden={true}></Form.Item>

                        <Form.Item name={"node_summary"} initialValue={res.data['nodes'][i]['node_summary']}>
                          <TextArea rows={5} placeholder="Description" style={{minWidth:'600px'}} defaultValue={res.data['nodes'][i]['node_summary']} />
                        </Form.Item> 

                        <Form.Item>
                          <Button style={{marginRight:10, color:'blue'}}  shape="circle" onClick={()=>closeEditNode(index)}> < CloseOutlined /> </Button> 
                          <Button htmlType="submit" style={{marginRight:10, color:'blue'}} shape="circle" onClick={()=>closeEditNode(index)} > < CheckOutlined /> </Button>
                        </Form.Item>
                        {/*<div style={{color:'red', marginBottom:'15px'}}><u style={{cursor:'pointer'}} onClick={()=>DeleteNode(index)}>Delete Node </u></div>*/}

                      </Form>
                      :
                      <div onClick={() => editNode(index)} style={{paddingLeft:'50px', paddingRight:'50px', paddingTop:'12px', paddingBottom:'12px', cursor:'pointer', whiteSpace: 'pre-wrap', wordBreak: 'break-all'}}>{res.data['nodes'][i]['description']}</div>
                    }

                </div>
              )               
            }

            else if(res.data['nodes'][i]['node_type'] == 2){

               result_nodes.push(
                <div>
                  <div style={{minWidth: '650px', minHeight: '100px', border: '1px solid black', display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', margin:'20px', borderRadius: '5px', boxShadow: '3px 4px 5px #888888'}}>
                      < EditOutlined onClick={() => editNode(index, desc, name, summary)}  style={{paddingTop:'5px', cursor:'pointer', marginLeft:'auto', marginRight:'10px'}} />
                      <div style={{display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', marginBottom:'15px', marginTop:'15px'}}>
                      
                      <div style={{paddingBottom: '10px', paddingTop: '10px', fontWeight: 'bold'}}>
                        {res.data['nodes'][i]['node_summary']}
                      </div>


                      <div>
                        {rows}
                        <Form
                          initialValues={{ remember: true,}}
                          {...layout}
                          onFinish={onFinishKeyValue}
                          style={{fontFamily: 'Helvetica, Arial, sans-serif', marginTop:'12px'}}>

                            <div style={{display:'flex', justifyContent:'center'}}>                                
                              <Form.Item name={"key"}> 
                                <Input placeholder="Key" style={{width:'165px', marginRight:'100px'}}/> 
                              </Form.Item> 

                              
                              <Form.Item name={"value"}> 
                                <Input placeholder="Value" style={{width:'165px'}} /> 
                              </Form.Item> 
                            </div>

                            <div style={{display:'flex', justifyContent:'center'}}>
                            <Form.Item>
                              <Button htmlType="submit" style={{color:'blue'}} shape="circle" onClick={()=>addKeyValue(index)} > < CheckOutlined /> </Button>
                            </Form.Item>
                            </div>

                          </Form>
                      </div> 

                      {typeof zero_bins != 'undefined' ?
                      <Bar
                        data={{
                          labels: mid_zero_bins,
                          datasets: [
                           {
                              label: 'Threshold: ' +threshold,
                              type: 'line',
                              backgroundColor:'red',
                              borderWidth: 2,
                              borderColor: 'red',
                              data: [
                                {x: threshold, y:0},
                                {x: threshold, y:length_zero}
                              ]
                            },
                            {
                              label: 'Class 0 Predictions Test',
                              borderColor: "blac",
                              lineTension: 0,
                              fill: false,
                              borderJoinStyle: "round",
                              data: zero_freq,
                              borderWidth: 0.2,
                              barPercentage: 1,
                              categoryPercentage: 1,
                              hoverBackgroundColor: "darkgray",
                              barThickness: "flex",
                              backgroundColor: "#29AB87"
                            }
                          ]
                        }}

                        options={{scales: {
                                  x: {
                                      type: 'linear',
                                      offset: false,
                                      grid: {
                                        offset: false
                                      },
                                      ticks: {
                                        stepSize: 0.1
                                      },
                                      title: {
                                        display: true,
                                        text: 'Probability',
                                        font: {
                                            size: 14
                                        }
                                      }
                                  }, 
                                  y: {
                                      title: {
                                        display: true,
                                        text: 'Frequency',
                                        font: {
                                            size: 14
                                        }
                                      }
                                  }
                                },
                                plugins: {
                                tooltip: {
                                  callbacks: {
                                    title: (items) => {
                                      return ``;
                                    }
                                  }
                                }
                              }
                          }}
                      />:
                      null}

                      {typeof one_bins != 'undefined' ?
                      <Bar
                        data={{
                          labels: mid_one_bins,
                          datasets: [
                            {
                              label: 'Val Threshold: ' +threshold,
                              type: 'line',
                              backgroundColor:'red',
                              borderColor: 'red',
                              borderWidth: 2,
                              data: [
                                {x: threshold, y:0},
                                {x: threshold, y:length_one}
                              ]
                            },
                            {
                              label: 'Class 1 Predictions Test',
                              borderColor: "blac",
                              lineTension: 0,
                              fill: false,
                              borderJoinStyle: "round",
                              data: one_freq,
                              borderWidth: 0.2,
                              barPercentage: 1,
                              categoryPercentage: 1,
                              hoverBackgroundColor: "darkgray",
                              barThickness: "flex",
                              backgroundColor: "#8AC7DB"
                            }

                          ]
                        }}

                        options={{scales: {
                                  x: {
                                      type: 'linear',
                                      offset: false,
                                      grid: {
                                        offset: false
                                      },
                                      ticks: {
                                        stepSize: 0.1
                                      },
                                      title: {
                                        display: true,
                                        text: 'Probability',
                                        font: {
                                            size: 14
                                        }
                                      }
                                  }, 
                                  y: {
                                      title: {
                                        display: true,
                                        text: 'Frequency',
                                        font: {
                                            size: 14
                                        }
                                      }
                                  }
                                },
                                plugins: {
                                tooltip: {
                                  callbacks: {
                                    title: (items) => {
                                      return ``;
                                    }
                                  }
                                }
                              }
                          }}
                      />:
                        null}

                      {typeof fpr != 'undefined' ?
                      <Line
                        data={{
                          labels: Array.from(fpr),
                          datasets: [
                            {
                              label: 'Test ROC AUC = '+String(test_auc),
                              data: Array.from(tpr),
                              borderWidth: 2,
                              borderColor: 'rgb(255, 99, 132)',
                              backgroundColor: 'rgba(255, 99, 132, 0.5)',                             
                            }
                          ]
                        }}
                        options={line_options}
                      />:
                      null}

                      {typeof metric_values != 'undefined' ?
                      <Line
                        data={{
                          labels: Array.from(Array(metric_values.length).keys()).map(n => n + 1),
                          datasets: [
                            {
                              label: metric_name,
                              data: Array.from(metric_values),
                              borderWidth: 2,
                              pointRadius: 2,
                              borderColor: 'rgb(255, 99, 132)',
                              backgroundColor: 'rgba(255, 99, 132, 0.5)',  
                              tooltip: false                           
                            },
                            {
                              label: 'Best '+metric_name+' = '+String(Array.from(metric_values)[metric_index]),
                              type: 'line',
                              backgroundColor: 'rgb(75, 192, 192)',
                              borderColor: 'rgb(75, 192, 192)',
                              data: [
                                {x: (metric_index+1), y:0}, 
                                {x: (metric_index+1), y:Math.max( ...Array.from(metric_values) )}
                              ]
                            },
                          ]
                        }}
                        options={{
                          plugins:{
                            tooltip: {
                                filter: function (tooltipItem) {
                                    return tooltipItem.datasetIndex === 0;
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
                                text: "Total Epochs (Start index: 1)"
                              }
                            },
                            y: {
                              title: {
                                display: true,
                                text: metric_name
                              }
                            }
                          }

                          }}
                      />:
                      null}

                      {typeof cmatrix != 'undefined' ?
                      <div style={{marginTop:'20px', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                        {cmatrix}
                      </div>
                      :
                      null}

                      </div>

                  </div>

                  <Modal visible={editNodeViewModalDict[res.data['nodes'][i]['id']]} closable={false} footer={null}>

                    <Form 
                      form={form}
                      initialValues={{ remember: true,}}
                      {...layout}
                      onFinish={onFinish}
                      style={{fontFamily: 'Helvetica, Arial, sans-serif'}}>
                        <Form.Item name={'node_id'} initialValue={res.data['nodes'][i]['id']} hidden={true}></Form.Item>

                        Name
                        <Form.Item name={"node_name"} initialValue={res.data['nodes'][i]['name']}> 
                          <Input placeholder="Node Name" style={{width:'165px'}} defaultValue={res.data['nodes'][i]['name']} /> 
                        </Form.Item> 

                        Description
                        <Form.Item name={"node_summary"} initialValue={JSON.stringify(res.data['nodes'][i]['node_summary']).slice(1, -1)}>
                          <TextArea rows={2} showCount placeholder="Summary" style={{width:'450px'}} defaultValue={JSON.stringify(res.data['nodes'][i]['node_summary']).slice(1, -1)} />
                        </Form.Item> 

                        <Form.Item>
                          <Button style={{marginRight:10, color:'blue'}}  shape="circle" onClick={()=>closeEditNode(index)}> < CloseOutlined /> </Button> 
                          <Button htmlType="submit" style={{marginRight:10, color:'blue'}} shape="circle" onClick={()=>closeEditNode(index)} > < CheckOutlined /> </Button>
                        </Form.Item>
                        <div style={{color:'red', marginBottom:'15px'}}><u style={{cursor:'pointer'}} onClick={()=>DeleteNode(index)}>Delete Node</u></div>

                      </Form>

                  </Modal>

                </div>

              )               
            }
            else{
              //do nothing
            }

          }

          setCSVNodes(csv_nodes)
          setMethodNodes(method_nodes)
          setResultNodes(result_nodes)
          setDatasetNodes(dataset_nodes)
          setVariableNodes(variable_nodes)
          setObjectiveNodes(objective_nodes)

        }})
    })
    .catch(err => {
      console.log(err.response.data); //style={{display:'flex', flexDirection:'column', justifyContent:'center'}}
      navigate("/login")
    })
  }, [props, refresh]);


  const onNodeCreate = (nodeType)  => {

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
        url: protocol+'://'+IP+'/api/create_node',
        data: {'run_id': props.run_id, 'node_type': nodeType},
        headers: {
          'Authorization': "JWT " + localStorage.getItem('access_token'),
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken}} )
      .then(res => { 
          setIsCreateNodeModalOpen(false)           
          setRefresh((prevValue) => prevValue + 1)
        })
    })
    .catch(err => {
      console.log("Error"); //style={{display:'flex', flexDirection:'column', justifyContent:'center'}}
      navigate("/login")
    })
  }





  return (
    <div>

    <Modal visible={isDeleteNodeModalOpen} closable={false}  footer={null}>
        <div style={{color:'red', marginBottom:'15px'}}><u>Are you sure you want to delete this Node? Deleted Nodes cannot be restored.</u></div>
        <Button onClick={()=>setIsDeleteNodeModalOpen(false)}>Cancel</Button> <Button type="primary" style={{backgroundColor:'red'}} onClick={handleDeleteNodeOk}>Delete</Button>
    </Modal>


      { props.run_id != -1 ? 

        <div style={{display:'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center'}}>
          <div style={{marginBottom:'15px', color:'#003568', fontSize:'17px', fontWeight:'bold', display:'flex', alignItems:'center'}}> 

            <Dragger action={imageUpload} customRequest={dummyRequest} showUploadList={false}>
              <span style={{marginRight:'20px', marginLeft:'20px'}}>Upload Images</span>
              { showUploadProgress == true ?
              <div style={{color:'green'}}>Success</div>:
              null}
            </Dragger>

           <Dropdown overlay={images} trigger={['click']}>
            <Tooltip placement="top" title="Images">
              <Button size="medium" shape="circle" style={{marginLeft:'5px', marginRight:'5px'}}> <FileImageOutlined /> </Button>
            </Tooltip> 
          </Dropdown>

          <Dragger action={fileUpload} customRequest={dummyRequest} showUploadList={false}>
            <span style={{marginRight:'20px', marginLeft:'20px'}}>Upload Files</span>
            { showFileUploadProgress == true ?
            <div style={{color:'green'}}>Success</div>:
            null}
          </Dragger>

          <Dropdown overlay={files} trigger={['click']}>
            <Tooltip placement="top" title="Files">
              <Button size="medium" shape="circle" style={{marginLeft:'5px', marginRight:'5px'}}> <FileOutlined /> </Button>
            </Tooltip> 
          </Dropdown>

         {/* <Dropdown overlay={systemInfo}>
            <Tooltip placement="top" title="System">
              <Button size="medium" shape="circle" style={{marginRight:'5px'}}> <DesktopOutlined /> </Button> 
            </Tooltip>
          </Dropdown>

          <Dropdown overlay={libraries}>
            <Tooltip placement="top" title="Libraries">
              <Button size="medium" shape="circle" style={{marginRight:'5px'}}> <ApartmentOutlined /> </Button>
            </Tooltip> 
          </Dropdown> */}

          Run ID: {props.run_id}</div> 
 

          <div style={{color:'#34568B', fontSize:'20px', fontWeight:'bold'}}>Objective</div>
          <div style={{display:'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', flexWrap:'wrap'}}>
            {objectiveNodes}
            {/*<PlusCircleOutlined style={{fontSize:'30px', paddingBottom:'30px'}} onClick={()=>onNodeCreate(5)} />*/}
          </div>

          <Divider />

          <div style={{color:'#34568B', fontSize:'20px', fontWeight:'bold'}}>Results</div>
          <div style={{display:'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', flexWrap:'wrap'}}>
            {resultNodes}
            <PlusCircleOutlined style={{fontSize:'30px', paddingBottom:'30px'}} onClick={()=>onNodeCreate(3)} />
          </div>

          <Divider />

          <div style={{color:'#34568B', fontSize:'20px', fontWeight:'bold'}}>Notes</div>
          <div style={{display:'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', flexWrap:'wrap'}}>
            {methodNodes}
            {/* <PlusCircleOutlined style={{fontSize:'30px', paddingBottom:'30px'}} onClick={()=>onNodeCreate(2)} /> */}
          </div>

          <Divider style={{fontSize:'20px'}} />

          <div style={{color:'#34568B', fontSize:'20px', fontWeight:'bold'}}>Data & Variables</div>
          <div style={{display:'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', flexWrap:'wrap'}}>
            {datasetNodes}
            {/* <PlusCircleOutlined style={{fontSize:'30px', paddingBottom:'30px'}} onClick={()=>onNodeCreate(0)} /> */}
          </div>

          <Divider /> 

          <div style={{color:'#34568B', fontSize:'20px', fontWeight:'bold'}}>CSV</div>
          <div style={{display:'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', flexWrap:'wrap'}}>
            {csvNodes}
          </div>

        </div>
      :
        null}

    </div>
  );
};

export default CreateGraph;
