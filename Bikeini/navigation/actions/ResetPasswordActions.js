import {
  REQUEST_NEW_PASSWORD_BEGIN,
  REQUEST_NEW_PASSWORD_FAILURE,
  REQUEST_NEW_PASSWORD_SUCCESS,
} from './types';

import serverApi from '../../utilities/serverApi';

export const requestNewPasswordBegin = () => (
  {
    type: REQUEST_NEW_PASSWORD_BEGIN,
  }
);

export const requestNewPasswordFailure = error => (
  {
    type: REQUEST_NEW_PASSWORD_FAILURE,
    payload: error,
  }
);

export const requestNewPasswordSuccess = () => (
  {
    type: REQUEST_NEW_PASSWORD_SUCCESS,
  }
);

export function requestNewPasswordInit(emailUsername) {
  let body = { emailUsername };
  body = JSON.stringify(body);
  return serverApi.postDispatch(
    'users/resetpassword/',
    body,
    'application/json',
    null,
    requestNewPasswordBegin,
    requestNewPasswordFailure,
    requestNewPasswordSuccess,
  );
}
