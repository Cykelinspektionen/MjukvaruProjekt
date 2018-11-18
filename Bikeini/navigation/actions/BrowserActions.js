import { FETCH_BIKES, FETCH_BIKES_SUCCESS } from './types';

export const fetchBikes = data => (
  {
    type: FETCH_BIKES,
    payload: data,
  }
);

export const fetchBikesSuccess = data => (
  {
    type: FETCH_BIKES_SUCCESS,
    payload: data,
  }
);
