import { LOGIN, LOGOUT } from '../actions/types';

const AUTH_STATE = {
  isLoggedIn: false,
  username: '',
  password: '',
  jwt: [],
};

const authState = (state = AUTH_STATE, action) => {
  switch (action.type) {
    case LOGIN:
      return { ...state, jwt: action.payload, isLoggedIn: true };
    case LOGOUT:
      return { ...state, jwt: [], isLoggedIn: false };
    default:
      return state;
  }
};

export default authState;
