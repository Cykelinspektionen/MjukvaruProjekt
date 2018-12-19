import {
  LOGIN,
  LOGOUT,
  SET_IS_LOGGED_IN,
  LOGIN_BEGIN,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  DELETE_USER_BEGIN,
  DELETE_USER_FAILURE,
  DELETE_USER_SUCCESS,
  DELETE_USER_RESET,
} from './types';
import serverApi from '../../utilities/serverApi';
import { loadProfileSuccess, unloadProfile } from './ProfileActions';
import { storeJWTInit, deleteJWTInit } from './JwtActions';

export const login = credentials => (
  {
    type: LOGIN,
    payload: credentials,
  }
);

export const logout = () => (
  {
    type: LOGOUT,
  }
);

export const setIsLoggedIn = bool => (
  {
    type: SET_IS_LOGGED_IN,
    payload: bool,
  }
);


export const loginBegin = () => (
  {
    type: LOGIN_BEGIN,
  }
);

export const loginFailure = error => (
  {
    type: LOGIN_FAILURE,
    payload: error,
  }
);

export const loginSuccess = () => (
  {
    type: LOGIN_SUCCESS,
  }
);

export const deletUserBegin = () => (
  {
    type: DELETE_USER_BEGIN,
  }
);

export const deletUserFailure = error => (
  {
    type: DELETE_USER_FAILURE,
    payload: error,
  }
);
export const deletUserSuccess = () => (
  {
    type: DELETE_USER_SUCCESS,
  }
);

export const deleteReset = () => (
  {
    type: DELETE_USER_RESET,
  }
);

function deletUserHandleResponse(json) {
  console.log('handle delete');
  console.log(json.message);
  return (dispatch) => {
    dispatch(unloadProfile());
    dispatch(deletUserSuccess());
    dispatch(deleteJWTInit());
  };
}

export function deleteUserInit(email, jwt) {
  let body = { email };
  body = JSON.stringify(body);
  return serverApi.postDispatch(
    'users/removeuser/',
    body,
    'application/json',
    jwt,
    deletUserBegin,
    deletUserFailure,
    deletUserHandleResponse,
  );
}

function handleUserData(json) {
  return (dispatch) => {
    if (json) {
      dispatch(storeJWTInit(json.data.token));
      dispatch(loadProfileSuccess(json.data.user));
    }
    dispatch(loginSuccess());
  };
}

export function loginInit(email, password) {
  let body = { email, password };
  body = JSON.stringify(body);
  return serverApi.postDispatch(
    'auth/',
    body,
    'application/json',
    null,
    loginBegin,
    loginFailure,
    handleUserData,
  );
}
