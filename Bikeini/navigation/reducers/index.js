import { combineReducers } from 'redux';
import loginReducer from './LoginReducers';
import signUpReducer from './SignUpReducers';
import reportStolenReducers from './ReportStolenReducers';
import PermissionsReducers from './PermissionsReducers';


export default combineReducers({
  loginState: loginReducer,
  signUpState: signUpReducer,
  myBikesState: reportStolenReducers,
  permissionState: PermissionsReducers,
});
