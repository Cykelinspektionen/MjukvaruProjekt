import { SET_LOCATION } from '../actions/types';

const PROFILE_INITIAL_STATE = {
  location: '',
  userName: '',
  email: '',
};

const profileReducer = (state = PROFILE_INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_LOCATION:
      return { ...state, location: action.payload };
    default:
      return state;
  }
};

export default profileReducer;
