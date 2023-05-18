import axios from 'axios';
import Cookies from 'js-cookie';
import IP from "../../components/ipConfig";
 
// Component -> Store (Actions)
// Change state based on action (Reducer)

export const navItem = (navItem) => {
	return { 
		type: 'NAV_ITEM',
		navItem: navItem
	}
}

export const authStart = () => {
	return { 
		type: 'AUTH_START',
		isAuthenticated: "false",
		user_type: null
	}
}

export const authSuccess = (user_type, id, name) => {
	console.log("actionslogin")
	return { 
		type: 'AUTH_SUCCESS',
		isAuthenticated: "true",
		user_type: user_type,
		user_id: id,
		name: name		
	}
}

export const authFail = () => {
	return { 
		type: 'AUTH_FAIL',
		isAuthenticated: "error",
		user_type: null,
		user_id: null,
		name: null,
		chatID: null,
		videoID: null,
		sender_authcode: null
	}
}

export const authLogout = () => {

	return {
		type: 'AUTH_LOGOUT', //action name
		token: null,
		isAuthenticated: "false",
		user_type: null,
		user_id: null,
		name: null,
		chatID: null,
		videoID: null,
		sender_authcode: null
	}
}

export const updateStart = () => {
	return { 
		type: 'UPDATE_START',
		update_error: null
	}
}

export const updateSuccess = (token) => {
	return { 
		type: 'UPDATE_SUCCESS',
		update_error: "none"
	}
}

export const updateFail = () => {
	return { 
		type: 'UPDATE_FAIL',
		update_error: "error"
	}
}

export const combineNodes = (node) => {
	return { 
		type: 'COMBINE_NODES',
		node,
	}
}

export const removeNodes = (node) => {
	return { 
		type: 'REMOVE_NODES',
		node,
	}
}