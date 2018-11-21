import {
  SET_LOCATION, LOAD_PROFILE_BEGIN, LOAD_PROFILE_SUCCES, LOAD_PROFILE_FAILURE,
} from '../actions/types';

const PROFILE_INITIAL_STATE = {
  location: '',
  username: '',
  email: '',
  phone_number: '',
  create_time: '',
  game_score: '',
  loadingProfile: false,
  profileLoaded: false,
  errorMsg: '',
  error: false,
};

const profileReducer = (state = PROFILE_INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_LOCATION:
      return { ...state, location: action.payload };
    case LOAD_PROFILE_BEGIN:
      return { ...state, loadingProfile: true };
    case LOAD_PROFILE_SUCCES:
      return {
        ...state,
        location: action.payload.location,
        username: action.payload.username,
        email: action.payload.email,
        phone_number: action.payload.phone_number,
        create_time: action.payload.create_time,
        game_score: action.payload.game_score,
        loadingProfile: false,
        profileLoaded: true,
      };
    case LOAD_PROFILE_FAILURE:
      return {
        ...state,
        loadingProfile: false,
        profileLoaded: false,
        error: true,
        errorMsg: action.payload,
      };
    default:
      return state;
  }
};

export default profileReducer;
