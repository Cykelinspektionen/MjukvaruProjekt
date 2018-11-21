// For running with emulator on same computer:
//      http://10.0.2.2:3000/
// Use 'localhost' when using external device on Home-Network
// and local IP-address when on Uni-network! :)

// Handle HTTP errors since fetch won't.
function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

const serverApi = {

  getDispatch(urlEnd, jwt, dispatchBegin, dispatchSucces, dispatchFailure) {
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
          console.log(json);
          dispatch(dispatchSucces(json));
          return json;
        })
        .catch(error => dispatch(dispatchFailure(error)));
    };
  },


  fetchApi(_urlEnd, _body, _contentType, _jwt) {
    // application/x-www-form-urlencoded ??
    // const formBody = Object.entries(_body).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
    return fetch(`https://bikeify.herokuapp.com/${_urlEnd}`, {
	  method: 'POST',
	  body: JSON.stringify(_body),
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
      method: 'POST',
      headers: {
        'x-access-token': _jwt,
      },
    // Authorization: 'Bearer ' + 'SECRET_OAUTH2_TOKEN_IF_AUTH' },
    })
      .then(response => response.json());
  },
};

export default serverApi;
