import {
  PROFILE_IMG_URI,
  SET_LOCATION,
  LOAD_PROFILE_BEGIN,
  LOAD_PROFILE_SUCCESS,
  LOAD_PROFILE_FAILURE,
  UPLOAD_PROFILE_IMG_BEGIN,
  UPLOAD_PROFILE_IMG_SUCCESS,
  UPLOAD_PROFILE_IMG_FAILURE,
  UNLOAD_PROFILE,
  RESET_PROFILE_NOTIFICATION,
  SET_PROFILE_NOTIFICATION,
} from '../actions/types';

const PROFILE_INITIAL_STATE = {
  id: '',
  location: '',
  username: '',
  email: '',
  phone_number: 0,
  create_time: '',
  imgToUploadUri: '',
  uriSet: false,
  uploadingImg: false,
  imgUploaded: false,
  game_score: {
    bike_score: 0,
    bikes_lost: 0,
    thumb_score: 0,
    total_score: 0,
  },
  loadingProfile: false,
  profileLoaded: false,
  error: '',
  profileNotification: false,
  avatarUri: { img: '', thumbnail: '' },
};

const profileReducer = (state = PROFILE_INITIAL_STATE, action) => {
  switch (action.type) {
    case PROFILE_IMG_URI:
      return {
        ...state,
        imgToUploadUri: action.payload,
        uriSet: true,
        uploadDisabled: false,
        imgUploaded: false,
      };
    case SET_LOCATION:
      return { ...state, location: action.payload };
    case LOAD_PROFILE_BEGIN:
      return { ...state, loadingProfile: true };

    case LOAD_PROFILE_FAILURE:
      return {
        ...state,
        loadingProfile: false,
        profileLoaded: false,
        error: action.payload,
      };
    case LOAD_PROFILE_SUCCESS:
      return {
        ...state,
        location: action.payload.location,
        username: action.payload.username,
        email: action.payload.email,
        phone_number: action.payload.phone_number,
        create_time: action.payload.create_time,
        game_score: action.payload.game_score,
        id: action.payload._id,
        loadingProfile: false,
        profileLoaded: true,
        profileNotification: action.payload.has_notification,
        avatarUri: action.payload.avatar_url || { img: '', thumbnail: '' },
      };
    case UNLOAD_PROFILE:
      return { ...PROFILE_INITIAL_STATE };
    case UPLOAD_PROFILE_IMG_BEGIN:
      return { ...state, uploadingImg: true };
    case UPLOAD_PROFILE_IMG_SUCCESS:
      return { ...state, avatarUri: action.payload.avatar_url };
    case UPLOAD_PROFILE_IMG_FAILURE:
      return { ...state, imgUploaded: false };
    case RESET_PROFILE_NOTIFICATION:
      return { ...state, profileNotification: false };
    case SET_PROFILE_NOTIFICATION:
      if (!state.profileNotification) {
        return { ...state, profileNotification: true };
      }
      return state;
    default:
      return state;
  }
};

export default profileReducer;
