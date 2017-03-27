const server = require('syncano-server').default;

const { socket } = server();

const verify = (email, token) => {
	socket.post('magiclink/verify', {
			email,
      token,
			status: 'disallow'
		}).then(data => {
			console.log('success');
		}).catch(err => {
			setResponse(new HttpResponse(400, JSON.stringify(`${err}`)));
		});
}
module.exports = verify;
