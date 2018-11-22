import {
  NEW_IMG_URI,
  SET_NEW_ID,
  REMOVE_IMG_URI,
  UPLOAD_IMG_BEGIN,
  UPLOAD_IMG_FAILURE,
  UPLOAD_IMG_SUCCES,
} from './types';
import serverApi from '../../utilities/serverApi';


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

export const clearImgUri = () => (
  {
    type: REMOVE_IMG_URI,
  }
);

export const imgUploadBegin = () => (
  {
    type: UPLOAD_IMG_BEGIN,
  }
);

export const imgUploadFailure = error => (
  {
    type: UPLOAD_IMG_FAILURE,
    payload: error,
  }
);

export const imgUploadSuccess = () => (
  {
    type: UPLOAD_IMG_SUCCES,
  }
);

export function imgUploadInit(imgUri, addType, jwt) {
  const file = {
    uri: imgUri,
    type: 'image/jpg',
    name: `${addType}.jpg`,
  };
  const formBody = new FormData();
  formBody.append('image', file);
  // TODO: change response handling to update bikeformData.... how that will be achieved...
  console.log(formBody);
  return serverApi.postDispatch(
    'bikes/preaddbike/',
    formBody,
    'multipart/form-data',
    jwt,
    imgUploadBegin,
    imgUploadFailure,
    imgUploadSuccess,
  );
}

export function uploadBikeToServer(imgUri, bikeData, jwt) {

}
