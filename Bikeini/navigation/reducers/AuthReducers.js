import {
  LOGIN, LOGOUT, LOAD_JWT_BEGIN, LOAD_JWT_SUCCES,
} from '../actions/types';

const AUTH_STATE = {
  isLoggedIn: false,
  username: '',
  password: '',
  jwt: [],
  loadingJwt: false,
};

const authState = (state = AUTH_STATE, action) => {
  switch (action.type) {
    case LOGIN:
      return { ...state, jwt: [action.payload], isLoggedIn: true };
    case LOGOUT:
      return { ...state, jwt: [], isLoggedIn: false };
    case LOAD_JWT_BEGIN:
      return { ...state, loadingJwt: true };
    case LOAD_JWT_SUCCES:
      return { ...state, jwt: [action.payload], loadingJwt: false };
    default:
      return state;
  }
};

export default authState;
