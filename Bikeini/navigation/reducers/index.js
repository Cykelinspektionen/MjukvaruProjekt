import { combineReducers } from 'redux';
import loginReducer from './LoginReducers';
import signUpReducer from './SignUpReducers';
import filterReducer from './FilterReducers';
import browserReducer from './BrowserReducers';

export default combineReducers({
  loginState: loginReducer,
  signUpState: signUpReducer,
  filterState: filterReducer,
  browserState: browserReducer,
});
