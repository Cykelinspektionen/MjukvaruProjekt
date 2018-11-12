import { combineReducers } from 'redux';
import loginReducer from './LoginReducers';
import signUpReducer from './SignUpReducers';

export default combineReducers({
  loginState: loginReducer,
  signUpState: signUpReducer,
});
