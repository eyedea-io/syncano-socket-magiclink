const server = require('syncano-server').default;

const verify = require('./helpers/verify');
const MagicLink = require('./helpers/magiclink');

const email = ARGS.email;

const { data, users } = server();
//token status link do magiclink class
//valid until - w klasie
const magiclink = (new MagicLink(email));
const createMagicLink = () => {
    const link = {
      link: magiclink.generateLink(META.instance),
      valid_until: magiclink.getValid(),
      token: magiclink.getToken(),
      email
    }
    data.magiclink.create(link)
    .then(()=>{})
    .catch(err => {
      setResponse(new HttpResponse(200, JSON.stringify(err), 'application/json'));
    });
}

const createUser = () => {
  users.create({
      username: email,
      password: magiclink.getToken(),
    }).then(createMagicLink).catch(err => {
      setResponse(new HttpResponse(400, JSON.stringify(err), 'application/json'));
    });
};

const authenticateUser = () => {
	verify(email, token, id);
}

users.where('username', 'eq', email)
	.firstOrFail()
	.then(user => {
		verify(email);
	})
	.catch(createUser);
