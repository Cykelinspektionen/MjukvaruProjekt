import { combineReducers } from 'redux';
import authReducer from './AuthReducers';
import signUpReducer from './SignUpReducers';
import filterReducer from './FilterReducers';
import browserReducer from './BrowserReducers';

export default combineReducers({
  loginState: authReducer,
  signUpState: signUpReducer,
  filterState: filterReducer,
  browserState: browserReducer,
});
