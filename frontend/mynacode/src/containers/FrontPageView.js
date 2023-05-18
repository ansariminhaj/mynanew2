import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Button, Checkbox, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useHistory, Link } from "react-router-dom";
import { connect } from 'react-redux';
import * as actions from '../store/actions/actions';
import axios from 'axios';
import Cookies from 'js-cookie';
import IP from "../components/ipConfig";
import FrontBeforeLogin from "../components/FrontBeforeLogin";
import FrontAfterLogin from "../components/FrontAfterLogin";

const FrontPageView = (props) => {

  return (
    <div>
      {props.isAuthenticated == 'true' || localStorage.getItem('isAuthenticated') == 'true' ?
      <FrontAfterLogin />
      :
      <FrontBeforeLogin />
      
    }
  </div>
  );
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.isAuthenticated
  }
}


export default connect(mapStateToProps, null)(FrontPageView);