import {
  LOGIN,
  LOGOUT,
  LOGIN_BEGIN,
  LOGIN_FAILURE,
  LOGIN_SUCCES,
} from './types';
import serverApi from '../../utilities/serverApi';
import { loadProfileSucces } from './ProfileActions';
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
    type: LOGIN_SUCCES,
  }
);

function handleUserData(json) {
  return (dispatch) => {
    if (json) {
      dispatch(storeJWTInit(json.data.token));
      dispatch(loadProfileSucces(json.data.user));
    }
    dispatch(loginSuccess());
  };
}

export function loginInit(email, password) {
  const body = { email, password };
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
