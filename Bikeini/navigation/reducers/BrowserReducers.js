import { FETCH_BIKES, FETCH_BIKES_SUCCESS } from '../actions/types';

const BROWSER_STATE = {
  showMissing: true,
  missingBicycles: [
    {
      key: '1', description: 'Bicycle 1', location: 'Gränby', model: 'Regular bike',
    },
    {
      key: '2', description: 'Bicycle 2', location: 'Gottsunda', model: 'Regular bike',
    },
    {
      key: '3', description: 'Bicycle 3', location: 'Stenhagen', model: 'Regular bike',
    },
    {
      key: '4', description: 'Bicycle 4', location: 'Gränby', model: 'Regular bike',
    },
    {
      key: '5', description: 'Bicycle 5', location: 'Gottsunda', model: 'Regular bike',
    },
    {
      key: '6', description: 'Bicycle 6', location: 'Stenhagen', model: 'Regular bike',
    }],
  foundBicycles: [
    {
      key: '11', description: 'Bicycle 11', location: 'Sunnersta', model: 'Regular bike',
    },
    {
      key: '12', description: 'Bicycle 12', location: 'Valsätra', model: 'Regular bike',
    },
    {
      key: '13', description: 'Bicycle 13', location: 'Norby', model: 'Regular bike',
    },
    {
      key: '14', description: 'Bicycle 14', location: 'Luthagen', model: 'Regular bike',
    }],
  showFilter: false,
  isLoading: false,
  isLoaded: false,
};

export default function browserReducer(state = BROWSER_STATE, action){
  switch (action.type) {
    case FETCH_BIKES:
      console.log('hello?');
      return Object.assign({}, state, {
        missingBicycles: [{
          key: '6', description: 'Bicycle 6', location: 'Stenhagen', model: 'Regular bike',
        }],
        isLoading: true,
      });
    case FETCH_BIKES_SUCCESS:
      console.log('bye');
      return {
        isLoading: false,
        isLoaded: true,
      };
    default:
      return state;
  }
};

/*
const browserReducer = (state = BROWSER_STATE, action) => {
  switch (action.type) {
    case FETCH_BIKES:
      console.log('hello?');
      return Object.assign({}, state, {
        missingBicycles: [{
          key: '6', description: 'Bicycle 6', location: 'Stenhagen', model: 'Regular bike',
        }],
        isLoading: true,
      });
    case FETCH_BIKES_SUCCESS:
      console.log('bye');
      return {
        isLoading: false,
        isLoaded: true,
      };
    default:
      return state;
  }
};

export default browserReducer;
*/
