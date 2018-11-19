import { combineReducers } from 'redux';
import authReducer from './AuthReducers';
import signUpReducer from './SignUpReducers';
import filterReducer from './FilterReducers';

export default combineReducers({
  loginState: authReducer,
  signUpState: signUpReducer,
  filterState: filterReducer,
});
