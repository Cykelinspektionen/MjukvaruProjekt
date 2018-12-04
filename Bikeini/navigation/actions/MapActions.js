import { SET_COORDS, SET_SHOW_MARKER, SET_MARKER } from './types';

export const setMapLocation = coords => (
  {
    type: SET_COORDS,
    payload: coords,
  }
);

export const setShowMarker = bool => (
  {
    type: SET_SHOW_MARKER,
    payload: bool,
  }
);

export const setMarker = coords => (
  {
    type: SET_MARKER,
    payload: coords,
  }
);
