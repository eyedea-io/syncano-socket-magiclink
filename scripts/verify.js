const server = require('syncano-server').default;
const token = ARGS.token
const email = ARGS.email;
const id = ARGS.id;
const status = ARGS.status;

const { users } = server();
users.where('username', 'eq', email)
	.firstOrFail()
	.then(user => {
		if(user.token === token) {
			users.update(user.id, {
			status
			}).then(data => {
				setResponse(new HttpResponse(200, JSON.stringify(data), 'application/json'));
			}).catch(err => {
				setResponse(new HttpResponse(400, JSON.stringify(err)));
			});
		} else {
			setResponse(new HttpResponse(200, JSON.stringify({message: 'Token has expired'}), 'application/json'));
		}
	}).catch(err =>{
		setResponse(new HttpResponse(400, JSON.stringify(err), 'application/json'));
	})



