import { combineReducers } from 'redux';
import authReducer from './AuthReducers';
import signUpReducer from './SignUpReducers';

export default combineReducers({
  loginState: authReducer,
  signUpState: signUpReducer,
});
