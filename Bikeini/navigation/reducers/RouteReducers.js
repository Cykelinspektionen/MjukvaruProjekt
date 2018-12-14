import {
  SET_ACTIVE_ROUTE,
} from '../actions/types';

const ROUTE_INITIAL_STATE = {
  activeRoute: '',
};

const routeReducer = (state = ROUTE_INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_ACTIVE_ROUTE:
      return { ...state, activeRoute: action.payload };
    default:
      return state;
  }
};

export default routeReducer;
