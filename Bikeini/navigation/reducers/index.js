import { combineReducers } from 'redux';
import authReducer from './AuthReducers';
import signUpReducer from './SignUpReducers';
import addBikeReducers from './AddBikeReducers';
import PermissionsReducers from './PermissionsReducers';


export default combineReducers({
  authState: authReducer,
  signUpState: signUpReducer,
  addBikeState: addBikeReducers,
  permissionState: PermissionsReducers,
});
