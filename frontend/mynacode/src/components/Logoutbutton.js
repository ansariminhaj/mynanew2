import React from 'react'
import { Button } from 'antd';
import { AudioOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import * as actions from '../store/actions/actions';

const Logoutbutton = (props) => {

  const onClick = () => {
    console.log("LOGOUT")
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.setItem('isAuthenticated', 'false') 
    props.authLogout()
  }

  return (
      <Button style={{padding:0, marginRight:'10px', fontSize:'15px', fontWeight:'bold', color:'#fdeedc', backgroundColor:'#3c6f7e', borderColor: '#3c6f7e'}} onClick={onClick}>
      Logout
      </Button>
    );
}


const mapDispatchToProps = dispatch => {
  return {
    authLogout: () => dispatch(actions.authLogout())
  }
}


export default connect(null, mapDispatchToProps)(Logoutbutton);