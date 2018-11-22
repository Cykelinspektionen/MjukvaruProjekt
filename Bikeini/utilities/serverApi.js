// For running with emulator on same computer:
//      http://10.0.2.2:3000/
// Use 'localhost' when using external device on Home-Network
// and local IP-address when on Uni-network! :)
import { Alert } from 'react-native';

// Handle HTTP errors since fetch won't.
function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

const serverApi = {

  getDispatch(urlEnd, jwt, dispatchBegin, dispatchFailure, dispatchSucces) {
    return (dispatch) => {
      dispatch(dispatchBegin());
      return fetch(`https://bikeify.herokuapp.com/${urlEnd}`, {
	    method: 'GET',
        headers: {
          'x-access-token': jwt,
        },
      })
        .then(handleErrors)
        .then(response => response.json())
        .then((json) => {
          dispatch(dispatchSucces(json));
          return true;
        })
        .catch((error) => {
          dispatch(dispatchFailure(error));
          return false;
        });
    };
  },

  postDispatch(urlEnd, body, contentType, jwt, dispatchBegin, dispatchFailure, dispatchSucces) {
    return (dispatch) => {
      dispatch(dispatchBegin());
      return fetch(`https://bikeify.herokuapp.com/${urlEnd}`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': contentType,
          'x-access-token': jwt,
        },
      })
        .then(handleErrors)
        .then(response => response.json())
        .then((json) => {
          if (json.error) {
            Alert.alert(json.error);
          } else if (json.status === 'error') {
            Alert.alert(json.message);
          }
          dispatch(dispatchSucces(json));
          return json;
        })
        .catch((error) => {
          console.log('GET:', error);
          dispatch(dispatchFailure(error));
          return false;
        });
    };
  },


  fetchApi(_urlEnd, _body, _contentType, _jwt) {
    // application/x-www-form-urlencoded ??
    // const formBody = Object.entries(_body).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
    return fetch(`https://bikeify.herokuapp.com/${_urlEnd}`, {
	  method: 'POST',
	  body: _body,
      headers: {
        'Content-Type': _contentType,
        'x-access-token': _jwt,
      },
    })
      .then(handleErrors)
      .then(response => response.json());
  },

  get(_urlEnd, _jwt) {
    return fetch(`https://bikeify.herokuapp.com/${_urlEnd}`, {
      method: 'GET',
      headers: {
        'x-access-token': _jwt,
      },
    // Authorization: 'Bearer ' + 'SECRET_OAUTH2_TOKEN_IF_AUTH' },
    })
      .then(response => response.json());
  },
};

export default serverApi;
