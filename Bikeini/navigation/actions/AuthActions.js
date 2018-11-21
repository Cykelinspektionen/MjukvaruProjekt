import { AsyncStorage } from 'react-native';
import {
  LOGIN, LOGOUT, LOAD_JWT_BEGIN, LOAD_JWT_SUCCES,
} from './types';

export const login = credentials => (
  {
    type: LOGIN,
    payload: credentials,
  }
);

export const logout = () => (
  {
    type: LOGOUT,
  }
);

export const loadJWTBegin = () => (
  {
    type: LOAD_JWT_BEGIN,
  }
);

export const loadJWTSucces = jwt => (
  {
    type: LOAD_JWT_SUCCES,
    payload: jwt,
  }
);

export function loadJWTInit() {
  return (dispatch) => {
    dispatch(loadJWTBegin());
    return AsyncStorage.getItem('id_token')
      .then((jwt) => {
        if (jwt !== null) {
          dispatch(loadJWTSucces(jwt));
        } else {
          // TODO: Handlefailure
        }
      });
  };
}
