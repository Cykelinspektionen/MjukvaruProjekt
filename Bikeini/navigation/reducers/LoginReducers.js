import { LOGIN } from '../actions/types';

const LOGIN_STATE = {
  isLoggedIn: false,
  username: '',
  password: '',
  jwt: '',
};
/*
const handleLogin = (state) => {
  const { userName, password } = state;
  // TODO: validate credentials
  return state;
};
*/
const loginReducer = (state = LOGIN_STATE, action) => {
  switch (action.type) {
    case LOGIN:
      const {
        username,
        password
      } = state;
      const jwt = action.payload;
      const newState = {username, password, jwt};
      return newState;
    default:
      return state;
  }
};

export default loginReducer;
