import { LOGIN } from './types';

export const login = credentials => (
  {
    type: LOGIN,
    payload: credentials,
  }
);

export const logout = credentials => (
  {
    type: LOGOUT,
    payload: credentials,
  }
);
