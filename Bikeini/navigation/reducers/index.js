import { combineReducers } from 'redux';
import authReducer from './AuthReducers';
import signUpReducer from './SignUpReducers';
import filterReducer from './FilterReducers';
import addBikeReducers from './AddBikeReducers';
import PermissionsReducers from './PermissionsReducers';
import profileReducer from './ProfileReducers';

export default combineReducers({
  authState: authReducer,
  signUpState: signUpReducer,
  filterState: filterReducer,
  addBikeState: addBikeReducers,
  permissionState: PermissionsReducers,
  profileState: profileReducer,
});
