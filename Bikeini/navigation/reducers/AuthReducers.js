import {
  LOGIN,
  LOGOUT,
  LOAD_PROFILE_SUCCES,
  LOAD_JWT_BEGIN,
  LOAD_JWT_FAILURE,
  LOAD_JWT_SUCCES,
  DELETE_JWT_BEGIN,
  DELETE_JWT_FAILURE,
  DELETE_JWT_SUCCES,
  LOGIN_BEGIN,
  LOGIN_FAILURE,
  LOGIN_SUCCES,
  STORE_JWT_BEGIN,
  STORE_JWT_FAILURE,
  STORE_JWT_SUCCESS,
} from '../actions/types';

const AUTH_STATE = {
  isLoggedIn: false,
  username: '',
  password: '',
  jwt: [],
  loadingJwt: false,
  deletingJwt: false,
  authorizing: false,
  storingJwt: false,
  error: '',
};

const authState = (state = AUTH_STATE, action) => {
  switch (action.type) {
    case LOGIN:
      return { ...state, jwt: [action.payload], isLoggedIn: true };
    case LOGOUT:
      return { ...state, jwt: [], isLoggedIn: false };
    case LOAD_PROFILE_SUCCES:
      return { ...state, isLoggedIn: true };
    case DELETE_JWT_BEGIN:
      return { ...state, deletingJwt: true };
    case DELETE_JWT_FAILURE:
      return { ...state, deletingJwt: false, error: action.payload };
    case DELETE_JWT_SUCCES:
      return { ...state, deletingJwt: false, jwt: [] };
    case LOAD_JWT_BEGIN:
      return { ...state, loadingJwt: true };
    case LOAD_JWT_FAILURE:
      return { ...state, loadingJwt: false, error: action.payload };
    case LOAD_JWT_SUCCES:
      return { ...state, loadingJwt: false, jwt: [action.payload] };
    case LOGIN_BEGIN:
      return { ...state, authorizing: true };
    case LOGIN_FAILURE:
      return { ...state, authorizing: false, error: action.payload };
    case LOGIN_SUCCES:
      return { ...state, authorizing: false };
    case STORE_JWT_BEGIN:
      return { ...state, storingJwt: true, jwt: [action.payload] };
    case STORE_JWT_FAILURE:
      return { ...state, storingJwt: false, error: action.payload };
    case STORE_JWT_SUCCESS:
      return { ...state, storingJwt: false };
    default:
      return state;
  }
};

export default authState;
