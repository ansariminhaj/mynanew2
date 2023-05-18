//import './App.css';
import React from 'react'
import { connect } from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import BaseRouter from './routes';
import CustomLayout from './containers/Layout'

const App = (props) => {

	return (
	  <div className="App">
	  	<BrowserRouter>
	      <CustomLayout isAuthenticated={props.isAuthenticated} navItem={props.navItem} user_type={props.user_type}>
		      <BaseRouter />
		  </CustomLayout>
		 </BrowserRouter>
	  </div>
	);
}

const mapStateToProps = state => {
	return {
		isAuthenticated: state.isAuthenticated,
		user_type: state['user_type'],
		navItem: localStorage.getItem('navItem')
	}
}

export default connect(mapStateToProps)(App);
