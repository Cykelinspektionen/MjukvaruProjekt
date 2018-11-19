import { LOGIN } from '../actions/types';

const AUTH_STATE = {
  isLoggedIn: false,
  username: '',
  password: '',
  jwt: [],
};

const authState = (state = AUTH_STATE, action) => {
  const { username, password } = state;
  let { jwt, isLoggedIn } = state;
  switch (action.type) {
    case LOGIN:
      jwt = action.payload;
      isLoggedIn = true;
      return {
        username, password, jwt, isLoggedIn,
      };
    default:
      return state;
  }
};

export default authState;
