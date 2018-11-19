import { combineReducers } from 'redux';
import authReducer from './AuthReducers';
import signUpReducer from './SignUpReducers';
import filterReducer from './FilterReducers';
import profileReducer from './ProfileReducers';

export default combineReducers({
  authState: authReducer,
  signUpState: signUpReducer,
  filterState: filterReducer,
  profileState: profileReducer,
});
