import {
  SET_LOCATION,
  SET_PROFILE_STATE,
  LOAD_PROFILE_BEGIN,
  LOAD_PROFILE_SUCCESS,
  LOAD_PROFILE_FAILURE,
  UNLOAD_PROFILE,
} from './types';
import serverApi from '../../utilities/serverApi';
import { deleteJWTInit } from './JwtActions';

export const setLocation = location => (
  {
    type: SET_LOCATION,
    payload: location,
  }
);

export const setProfile = data => (
  {
    type: SET_PROFILE_STATE,
    payload: data,
  }
);

export const loadProfileBegin = () => (
  {
    type: LOAD_PROFILE_BEGIN,
  }
);

export const loadProfileSuccess = data => (
  {
    type: LOAD_PROFILE_SUCCESS,
    payload: data,
  }
);

export const loadProfileFailure = error => (
  {
    type: LOAD_PROFILE_FAILURE,
    payload: error,
  }
);

export const unloadProfile = () => (
  {
    type: UNLOAD_PROFILE,
  }
);

function handleProfileData(data) {
  return (dispatch) => {
    if (data.status === 'error') {
      dispatch(deleteJWTInit());
      dispatch(loadProfileFailure(data.message));
    } else {
      dispatch(loadProfileSuccess(data));
    }
  };
}

export function loadProfileInit(jwt) {
  return serverApi.getDispatch('users/getuser/', jwt, loadProfileBegin, loadProfileFailure, handleProfileData);
}
