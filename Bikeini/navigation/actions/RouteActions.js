import {
  SET_ACTIVE_ROUTE,
} from './types';

export const setActiveRoute = route => (
  {
    type: SET_ACTIVE_ROUTE,
    payload: route,
  }
);
