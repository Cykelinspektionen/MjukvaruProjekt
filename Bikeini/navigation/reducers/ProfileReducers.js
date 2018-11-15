import { LOCATION } from '../actions/types';

const LOCATION_STATE = {
  location: '',
};

const profileReducer = (state = LOCATION_STATE, action) => {
  const { location } = state;
  let city = state;
  switch (action.type) {
    case LOCATION:
      city = action.payload;
      return {
        location, city,
      };
    default:
      return state;
  }
};

export default profileReducer;
