// For running with emulator on same computer:
//      http://10.0.2.2:3000/
// Use 'localhost' when using external device on Home-Network
// and local IP-address when on Uni-network! :)
const serverApi = {
	fetchApi(_urlEnd, _body){
			return fetch('http://130.243.193.118:8080/'+_urlEnd,{
			      method: 'POST',
			      body: JSON.stringify(_body),
			      headers: {"Content-Type": "application/json"}
			    })
			.then((response) => response.json());
		}
};

export default serverApi;