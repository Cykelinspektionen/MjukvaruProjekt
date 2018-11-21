import {
  SET_LOCATION, SET_PROFILE_STATE, LOAD_PROFILE_BEGIN, LOAD_PROFILE_SUCCES, LOAD_PROFILE_FAILURE,
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

export const loadProfileSucces = data => (
  {
    type: LOAD_PROFILE_SUCCES,
    payload: data,
  }
);

export const loadProfileFailure = error => (
  {
    type: LOAD_PROFILE_FAILURE,
    payload: error,
  }
);

function handleProfileData(data) {
  return (dispatch) => {
    console.log(data);
    if (data.status === 'error') {
      dispatch(deleteJWTInit());
      dispatch(loadProfileFailure(data.message));
    } else {
      dispatch(loadProfileSucces(data));
    }
  };
}

export function loadProfileInit(jwt) {
  return serverApi.getDispatch('users/getuser/', jwt, loadProfileBegin, loadProfileFailure, handleProfileData);
}
