import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';

import { GET_ERRORS, SET_CURRENT_USER } from './types';

// Register User
export const registerUser = (userData, history) => dispatch => {
  axios.post('api/users/register', userData)
      .then(res => history.push('/login'))
      .catch(err => dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      }));
};

// Login - Get User Token
export const loginUser = (userData) => dispatch => {
  axios.post('api/users/login', userData)
    .then(res => {
      // Get jwtToken
      const { token } = res.data;
      // Save token to Local Storage
      localStorage.setItem('jwtToken', token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const base64Url = token.split('.')[1];
      const decoded = JSON.parse(window.atob(base64Url));
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err => dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    }));
}

// Set logged in user
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  }
}

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from localStorage
  localStorage.removeItem('jwtToken');
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
}