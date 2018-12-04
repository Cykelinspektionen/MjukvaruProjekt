import { SET_COORDS } from '../actions/types';


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
};

const mapReducer = (state = MAP_STATE, action) => {
  switch (action.type) {
    case SET_COORDS:
      return {
        ...state, ...action.payload, loadedCurrPos: true,
      };
    default:
      return state;
  }
};

export default mapReducer;
