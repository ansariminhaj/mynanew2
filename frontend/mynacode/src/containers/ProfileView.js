import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import LoginForm from '../components/LoginForm';
import { Card, Avatar, Divider, Image, Tabs, List, Rate, Collapse } from 'antd';
import { Link } from 'react-router-dom';
import { EditOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useNavigate } from "react-router-dom";
import { connect } from 'react-redux';
import * as actions from '../store/actions/actions';
import IP from "../components/ipConfig";
import protocol from "../components/httpORhttps";

const { TabPane } = Tabs;
const { Panel } = Collapse;

const ProfileView = props => {
	const navigate = useNavigate()

	let [user, setUser] = useState("");
	let [student, setStudent] = useState("");

	const Edit= () => {
	    let path = '/edit_profile';
	    let whole_user = {
	    	...user,
	    	...student
	    }
	    navigate(
	      {pathname: path,
	       state: whole_user}); 
	}

	useEffect(() => {
		props.navItem('none')
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
				url: protocol+'://'+IP+'/api/profile',
				headers: {
					'Authorization': "JWT " + localStorage.getItem('access_token'),
					'Content-Type': 'application/json',
					'X-CSRFToken': csrftoken}} )
			.then(res => {
				setUser(res.data)
			})
		})
		.catch(err => {
			console.log(err.response.data);
			navigate("/login")
		})}, [props]); 	

	var skill_list = [];

	const { Meta } = Card;

	return (
			<div>

			  <Card style={{ width: '100%' }}>
			    <Meta
			      avatar={<Avatar src={user.image} />}
			      title={<span>{user.name}</span>}
			    />

			    <Tabs defaultActiveKey="1">


				    <TabPane tab={"Account Information"} key="1">
				   		<h3 style={{marginTop:5, marginBottom:0}}>Username</h3>
					    <p style={{marginBottom:0}}>{user.username}</p>
					    <p>{user.phone}</p>
					    <h3 style={{marginTop:5, marginBottom:0}}>Key</h3>
					    <p>{user.key}</p>
					    <h3 style={{marginTop:5, marginBottom:0}}>Email</h3>
					    <p>{user.email}</p>
					    <h3 style={{marginTop:5, marginBottom:0}}>Account Type</h3>
					    <p>{user.account_type}</p>
					    
							{/*<Button onClick={Edit}><EditOutlined key="edit" /></Button>*/}
				    </TabPane>

				</Tabs>

			  </Card>
			</div>
	)
}

const mapStateToProps = state => {
	console.log("profielview")
  return {
    navItem: state.navItem,
    isAuthenticated: state.isAuthenticated
  }
}

const mapDispatchToProps = dispatch => {
  return {
    navItem: (navItem) => dispatch(actions.navItem(navItem))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileView);