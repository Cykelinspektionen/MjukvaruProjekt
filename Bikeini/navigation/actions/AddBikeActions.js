import {
  NEW_IMG_URI,
  UPLOAD_IMG_BEGIN,
  UPLOAD_IMG_FAILURE,
  UPLOAD_IMG_SUCCESS,
  UPLOAD_BIKE_BEGIN,
  UPLOAD_BIKE_FAILURE,
  UPLOAD_BIKE_SUCCESS,
  SET_BIKE_POSTED,
} from './types';
import serverApi from '../../utilities/serverApi';


export const saveImageToState = uri => (
  {
    type: NEW_IMG_URI,
    payload: uri,
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
    type: UPLOAD_IMG_SUCCESS,
  }
);

export const bikeUploadBegin = () => (
  {
    type: UPLOAD_BIKE_BEGIN,
  }
);

export const bikeUploadFailure = () => (
  {
    type: UPLOAD_BIKE_FAILURE,
  }
);

export const bikeUploadSuccess = () => (
  {
    type: UPLOAD_BIKE_SUCCESS,
  }
);

export const setBikePosted = bool => (
  {
    type: SET_BIKE_POSTED,
    payload: bool,
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


export function uploadBikeToServer(imgUri, bikeData2, jwt) {
  console.log('uploadBikeToServer -> BEGINS');
  const bikeData = bikeData2;
  const file = {
    uri: imgUri,
    type: 'image/jpg',
    name: `${bikeData.type}.jpg`,
  };
  const formBody = new FormData();
  formBody.append('image', file);
  formBody.append('json', JSON.stringify(bikeData));
  return serverApi.postDispatch(
    'bikes/addbike2/',
    formBody,
    'multipart/form-data',
    jwt,
    bikeUploadBegin,
    bikeUploadFailure,
    bikeUploadSuccess,
  );
}
