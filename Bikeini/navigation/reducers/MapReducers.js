import { SET_COORDS, SET_SHOW_MARKER, SET_MARKER, SET_USER_MARKER } from '../actions/types';


const MAP_STATE = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
  accuracy: 0,
  altitude: 0,
  altitudeAccuracy: 0,
  city: '',
  country: '',
  heading: 0,
  isoCountryCode: '',
  name: '',
  postalCode: 0,
  region: '',
  speed: 0,
  street: '',
  loadedCurrPos: false,
  marker: {
    showMarker: false,
    latitude: 59.856,
    longitude: 17.630,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  userMarker: {
    userMarkerSet: false,
    latitude: 59.856,
    longitude: 17.630,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
};

const mapReducer = (state = MAP_STATE, action) => {
  switch (action.type) {
    case SET_COORDS:
      return {
        ...state, ...action.payload, loadedCurrPos: true,
      };
    case SET_SHOW_MARKER:
      return { ...state, marker: { ...state.marker, showMarker: action.payload } };
    case SET_MARKER:
      return { ...state, marker: { ...state.marker, ...action.payload } };
    case SET_USER_MARKER:
      return { ...state, userMarker: { ...state.userMarker, ...action.payload, userMarkerSet: true } };
    default:
      return state;
  }
};

export default mapReducer;
