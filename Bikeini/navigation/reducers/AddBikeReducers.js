import {
  NEW_IMG_URI,
  REMOVE_IMG_URI,
  UPLOAD_IMG_BEGIN,
  UPLOAD_IMG_FAILURE,
  UPLOAD_IMG_SUCCES,
} from '../actions/types';
// !addBikeState.uriSet && !addBikeState.uploadingImg && !addBikeState.imgUploaded

const ADD_BIKE_STATE = {
  newBikeID: '',
  imgToUploadUri: '',
  uriSet: false,
  uploadingImg: false,
  imgUploaded: false,
  error: '',
  uploadDisabled: true,
};

const addBikeReducers = (state = ADD_BIKE_STATE, action) => {
  switch (action.type) {
    case NEW_IMG_URI:
      return {
        ...state,
        imgToUploadUri: action.payload,
        uriSet: true,
        uploadDisabled: false,
        imgUploaded: false,
      };
    case REMOVE_IMG_URI:
      return {
        ...state,
        imgToUploadUri: '',
        uriSet: false,
        uploadDisabled: true,

      };
    case UPLOAD_IMG_BEGIN:
      return { ...state, uploadingImg: true, uploadDisabled: true };
    case UPLOAD_IMG_FAILURE:
      return {
        ...state, uploadingImg: false, error: action.payload, uploadDisabled: false,
      };
    case UPLOAD_IMG_SUCCES:
      return {
        ...state, uploadingImg: false, imgUploaded: true, uploadDisabled: true,
      };
    default:
      return state;
  }
};

export default addBikeReducers;
