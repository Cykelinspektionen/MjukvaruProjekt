import {
  NEW_IMG_URI,
  UPLOAD_IMG_BEGIN,
  UPLOAD_IMG_FAILURE,
  UPLOAD_IMG_SUCCESS,
  UPLOAD_BIKE_BEGIN,
  UPLOAD_BIKE_FAILURE,
  UPLOAD_BIKE_SUCCESS,
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


export function imgUploadInit(imgUri, addType, jwt) {
  const file = {
    uri: imgUri,
    type: 'image/jpg',
    // TODO: FIX NAME!!!
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
  const bikeData = bikeData2;
  const file = {
    uri: imgUri,
    type: 'image/jpg',
    // TODO: FIX NAME!!!
    name: `${bikeData.type}.jpg`,
  };
  const formBody = new FormData();
  formBody.append('image', file);
  // Object.entries(bikeData).map(([key, value]) => formBody.append(key, value));
  // Object.entries(bikeData.location).map(([key, value]) => formBody.append('location', value));
  // Object.entries(bikeData.keywords).map(([key, value]) => formBody.append('keywords', value));
  formBody.append('json', JSON.stringify(bikeData));
  return serverApi.postDispatchLocal(
    'bikes/addbike/',
    formBody,
    'multipart/form-data',
    jwt,
    bikeUploadBegin,
    bikeUploadFailure,
    bikeUploadSuccess,
  );
}
