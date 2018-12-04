import { combineReducers } from 'redux';
import authReducer from './AuthReducers';
import signUpReducer from './SignUpReducers';
import filterReducer from './FilterReducers';
import addBikeReducers from './AddBikeReducers';
import PermissionsReducer from './PermissionsReducers';
import profileReducer from './ProfileReducers';
import mapReducer from './MapReducers';

export default combineReducers({
  authState: authReducer,
  signUpState: signUpReducer,
  filterState: filterReducer,
  addBikeState: addBikeReducers,
  permissionState: PermissionsReducer,
  profileState: profileReducer,
  mapState: mapReducer,
});
