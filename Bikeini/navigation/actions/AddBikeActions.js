import { NEW_IMG_URI, SET_NEW_ID } from './types';

export const saveImageToState = uri => (
  {
    type: NEW_IMG_URI,
    payload: uri,
  }
);

export const saveNewBikeID = id => (
  {
    type: SET_NEW_ID,
    payload: id,
  }
);
