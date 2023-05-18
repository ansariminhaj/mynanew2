import { updateObject } from '../utility';

const initialState = {
	isAuthenticated: 'false',
	signup_error: null,
	update_error: null,
	loading: false,
	user_type: null,
	user_id: null,
	name: null,
	chatID: null,
	videoID: null,
	sender_authcode: null,
	navItem: 'forum',
	notif_notifications: 'false',
	message_notifications: 'false',
	node:[]
}

const navItem = (state, action) => {
	return updateObject(state, {
		navItem: action.navItem
	});
}

const authSuccess = (state, action) => {
	console.log(action)
	return updateObject(state, {
		isAuthenticated: action.isAuthenticated,
		user_type: action.user_type,
		user_id: action.user_id,
		name: action.name,
		loading: false
	});
}

const authFail = (state, action) => {
	return updateObject(state, {
		isAuthenticated: action.isAuthenticated,
		loading: false
	});
}

const authLogout = (state, action) => {
	console.log("reducer logout")
	return updateObject(state, {
		isAuthenticated: action.isAuthenticated,
		user_type: action.user_type,
		user_id: action.user_id,
		name: action.name,
		chatID: action.chatID,
		videoID: action.videoID,
		sender_authcode: action.sender_authcode,
		loading: false
	});
}

const updateStart = (state, action) => {
	return updateObject(state, {
		update_error: action.update_error,
		loading: false
	});
}


const updateSuccess = (state, action) => {
	return updateObject(state, {
		update_error: action.update_error,
		loading: false
	});
}

const updateFail = (state, action) => {
	return updateObject(state, {
		update_error: action.update_error,
		loading: false
	});
}

const combineNodes = (state, action) => {
	return updateObject(state, {
		node: [...state.node, action.node],
		loading: false
	});
}

const removeNodes = (state, action) => {
	for(let i=0;i<state.node.length;i++){
		if ((state.node[i][0] == action.node[0]) && (state.node[i][1] == action.node[1]) && (state.node[i][2] == action.node[2])){
			console.log("EQUALS")
			state.node.splice(i, 1);
		} 
	}
	return updateObject(state, {
		node: state.node,
		loading: false
	});
}


const reducer = (state=initialState, action) => {
	switch(action.type){
		case 'AUTH_LOGOUT': return authLogout(state, action);
		case 'AUTH_SUCCESS': return authSuccess(state, action);
		case 'AUTH_FAIL': return authFail(state, action);
		case 'UPDATE_START': return updateStart(state, action);
		case 'UPDATE_SUCCESS': return updateSuccess(state, action);
		case 'UPDATE_FAIL': return updateFail(state, action);
		case 'NAV_ITEM': return navItem(state, action);
		case 'COMBINE_NODES': return combineNodes(state, action);
		case 'REMOVE_NODES': return removeNodes(state, action);
		default: return state;
	}
}


export default reducer;