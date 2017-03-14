const randToken = require('rand-token');
const server = require('syncano-server').default;
const generate = require('./helpers/generators')
const uid = randToken.uid;
const token = uid(16);

const email = ARGS.email;

const { data } = server();

data['link_storage'].list().then(users => {
	const found = users.find(user => {
		return user.email === email;
	})
	if (found) {
		// IMPLEMENT VERIFY HERE
		console.log(users);
	} else {
		const link = generate.link(email, token);

		data['link_storage'].create({
			link,
			email,
			status: 'disallow',
			token
		}).then(data => {
			setResponse(new HttpResponse(200, JSON.stringify(`User created with email: ${data.link}`), 'text/plain'));
		}).catch(err => {
			setResponse(new HttpResponse(200, JSON.stringify(`${err}`), 'text/plain'));
		})
	}
}).catch(err => {
	console.error(err);
});

