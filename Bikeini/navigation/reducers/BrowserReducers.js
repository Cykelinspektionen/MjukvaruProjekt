import { FETCH_BIKES, FETCH_BIKES_SUCCESS } from '../actions/types';

const BROWSER_STATE = {
  showMissing: true,
  missingBicycles: [
    { key: '1', name: 'Bicycle 1', location: 'Gränby' },
    { key: '2', name: 'Bicycle 2', location: 'Gottsunda' },
    { key: '3', name: 'Bicycle 3', location: 'Stenhagen' },
    { key: '4', name: 'Bicycle 4', location: 'Gränby' },
    { key: '5', name: 'Bicycle 5', location: 'Gottsunda' },
    { key: '6', name: 'Bicycle 6', location: 'Stenhagen' } ],
  foundBicycles: [
    { key: '11', name: 'Bicycle 11', location: 'Sunnersta' },
    { key: '12', name: 'Bicycle 12', location: 'Valsätra' },
    { key: '13', name: 'Bicycle 13', location: 'Norby' },
    { key: '14', name: 'Bicycle 14', location: 'Luthagen' } ],
  showFilter: false,
  isLoading: false,
  isLoaded: false,
};

const browserReducer = (state = BROWSER_STATE, action) => {
  const { showMissing, showFilter } = state;
  let { missingBicycles, isLoading, isLoaded } = state;
  switch (action.type) {
    case FETCH_BIKES:
      return {
        ...state,
        missingBicycles: [{ key: '11', name: 'Bicycle 11', location: 'Sunnersta' }],
        isLoading: true,
      };
    case FETCH_BIKES_SUCCESS:
      return {
        isLoading: false,
        isLoaded: true,
        data: action.payload
      }
    default:
      return state;
  }
};

export default browserReducer;
