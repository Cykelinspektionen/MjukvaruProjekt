import { combineReducers } from 'redux';
import loginReducer from './LoginReducers';
import signUpReducer from './SignUpReducers';
import addBikeReducers from './AddBikeReducers';
import PermissionsReducers from './PermissionsReducers';


export default combineReducers({
  loginState: loginReducer,
  signUpState: signUpReducer,
  addBikeState: addBikeReducers,
  permissionState: PermissionsReducers,
});
