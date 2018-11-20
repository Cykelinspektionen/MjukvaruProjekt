import { LOGIN, LOGOUT } from './types';

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
