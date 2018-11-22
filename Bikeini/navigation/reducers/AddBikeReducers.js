import {
  NEW_IMG_URI,
  REMOVE_IMG_URI,
  UPLOAD_IMG_BEGIN,
  UPLOAD_IMG_FAILURE,
  UPLOAD_IMG_SUCCES,
} from '../actions/types';

const ADD_BIKE_STATE = {
  newBikeID: '',
  imgToUploadUri: '',
  uriSet: false,
  uploadingImg: false,
  imgUploaded: false,
  error: '',
};

const addBikeReducers = (state = ADD_BIKE_STATE, action) => {
  switch (action.type) {
    case NEW_IMG_URI:
      return {
        ...state,
        imgToUploadUri: action.payload,
        uriSet: true,
        imgUploaded: false,
      };
    case REMOVE_IMG_URI:
      return {
        ...state,
        imgToUploadUri: '',
        uriSet: false,
      };
    case UPLOAD_IMG_BEGIN:
      return { ...state, uploadingImg: true };
    case UPLOAD_IMG_FAILURE:
      return { ...state, uploadingImg: false, error: action.payload };
    case UPLOAD_IMG_SUCCES:
      return { ...state, uploadingImg: false, imgUploaded: true };
    default:
      return state;
  }
};

export default addBikeReducers;
