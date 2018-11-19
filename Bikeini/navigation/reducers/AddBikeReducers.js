import { NEW_IMG_URI, REMOVE_IMG_URI } from '../actions/types';

const ADD_BIKE_STATE = {
  newBikeID: '',
  imgToUploadUri: '',
  uriSet: false,
};

const addBikeReducers = (state = ADD_BIKE_STATE, action) => {
  switch (action.type) {
    case NEW_IMG_URI:
      return {
        ...state,
        imgToUploadUri: action.payload,
        uriSet: true,
      };
    case REMOVE_IMG_URI:
      return {
        ...state,
        imgToUploadUri: '',
        uriSet: false,
      };
    default:
      return state;
  }
};

export default addBikeReducers;
