import { LOGIN } from '../actions/types';

const LOGIN_STATE = {
  isLoggedIn: false,
  username: '',
  password: '',
  jwt: '',
};

const loginReducer = (state = LOGIN_STATE, action) => {
  const { username, password } = state;
  let { jwt } = state;
  switch (action.type) {
    case LOGIN:
      jwt = action.payload;
      return { username, password, jwt };
    default:
      return state;
  }
};

export default loginReducer;
