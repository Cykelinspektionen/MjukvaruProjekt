import { combineReducers } from 'redux';
import authReducer from './AuthReducers';
import signUpReducer from './SignUpReducers';
import profileReducer from './ProfileReducers';

export default combineReducers({
  loginState: authReducer,
  signUpState: signUpReducer,
  profileState: profileReducer,
});
