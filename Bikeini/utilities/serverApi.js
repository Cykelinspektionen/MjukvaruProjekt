// For running with emulator on same computer:
//      http://10.0.2.2:3000/
// Use 'localhost' when using external device on Home-Network
// and local IP-address when on Uni-network! :)
const serverApi = {
  fetchApi(_urlEnd, _body, _contentType, _jwt) {
    return fetch(`https://bikeify.herokuapp.com/${_urlEnd}`, {
    method: 'POST',
    body: JSON.stringify(_body),
      headers: {
        'Content-Type': _contentType,
        'x-access-token': _jwt,
      },
    // Authorization: 'Bearer ' + 'SECRET_OAUTH2_TOKEN_IF_AUTH' },
    })
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