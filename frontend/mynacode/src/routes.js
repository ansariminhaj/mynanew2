import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProfileView from './containers/ProfileView';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import SignupSuccess from './components/SignupSuccess';
import EditProfileView from './containers/EditProfileView';
import FrontPageView from './containers/FrontPageView'
import Docs from './containers/Docs'
import ForgotPasswordEmail from './components/ForgotPasswordEmail';
import ForgotPasswordCode from './components/ForgotPasswordCode';
import Feedback from './containers/Feedback'
import AdminPanel from './containers/AdminPanel'

const BaseRouter = () => (

	    <Routes>
	    	<Route exact path = '/' element={<FrontPageView/>} />
			<Route path = '/login' element={<LoginForm/>} />
			<Route path = '/signup' element={<SignupForm/>} />
			<Route path = '/signup_success' element={<SignupSuccess/>} />
			<Route path = '/profile' element={<ProfileView/>} />
			<Route path = '/edit_profile' element={<EditProfileView/>} />
			<Route path = '/docs' element={<Docs/>} />
			<Route path = '/frontpage' element={<FrontPageView/>} />
			<Route path = '/enter_email' element={<ForgotPasswordEmail/>} />
			<Route path = '/enter_code' element={<ForgotPasswordCode/>} />
			<Route path = '/feedback' element={<Feedback/>} />
			<Route path = '/admin_panel' element={<AdminPanel/>} />
		</Routes>

);

export default BaseRouter;

