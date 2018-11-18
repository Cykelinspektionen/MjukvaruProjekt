import { FETCH_BIKES } from './types';

export function fetchBikes(data) {
  return {
    type: FETCH_BIKES,
    payload: data,
  };
}
/*

export const fetchBikesSuccess = data => (
  {
    type: FETCH_BIKES_SUCCESS,
    payload: data,
  }
);
*/
