import {
  LOGIN,
  LOGOUT,
  LOGIN_BEGIN,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
} from './types';
import serverApi from '../../utilities/serverApi';
import { loadProfileSuccess } from './ProfileActions';
import { storeJWTInit } from './JwtActions';

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
