const server = require('syncano-server').default;

const randToken = require('rand-token');
const generate = require('./helpers/generators');
const verify = require('./helpers/verify');


const uid = randToken.uid;
const token = uid(16);

const email = ARGS.email;

let { data, socket, users } = server();

const createUser = () => {
	const link = generate.link(email, token, 'allow');
	users.create({
			username: email,
			password: token,
			email,
			token,
			status: 'disallow',
			link
		}).then(data => {
			setResponse(new HttpResponse(200, JSON.stringify(data), 'application/json'));
			console.log(data);
		}).catch(err => {
			setResponse(new HttpResponse(400, JSON.stringify(err), 'application/json'));
		});
};
const authenticateUser = () => {
	verify(email, token, id);	
}

users.where('username', 'eq', email)
	.firstOrFail()
	.then(user => {
		verify(email, token, user.id, user.user_key);
	})
	.catch(createUser);