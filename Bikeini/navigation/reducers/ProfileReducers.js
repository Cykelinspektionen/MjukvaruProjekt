import { SET_LOCATION } from '../actions/types';

const PROFILE_INITIAL_STATE = {
  location: '',
  username: '',
  email: '',
  phone_number: '',
  create_time: '',
  _id: '',
  game_score: '',
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
