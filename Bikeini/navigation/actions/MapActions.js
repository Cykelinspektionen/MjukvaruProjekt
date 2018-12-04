import { SET_COORDS, ROLL } from './types';

export const setMapLocation = coords => (
  {
    type: SET_COORDS,
    payload: coords,
  }
);

export const setCameraRollPermission = status => (
  {
    type: ROLL,
    payload: status,
  }
);
