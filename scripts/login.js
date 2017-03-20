const server = require('syncano-server').default;
const verify = require('./helpers/confirm');
const sendEmail = require('./helpers/mailgun').sendEmail;
const MagicLink = require('./helpers/magiclink');

const email = ARGS.email;

const magiclink = new MagicLink(email);


const { data, users } = server();

const updateMagicLink = (_email) => {
  data.magiclink.where('email', _email)
    .firstOrFail()
    .then(link => {
      const _link = link;
      const magiclink = new MagicLink(email);
      const linkUpdate = {
        link: magiclink.generateLink(META.instance),
        valid_until: magiclink.getValid(),
        token: magiclink.getToken(),
        email
      }
      data.magiclink.update(_link.id, linkUpdate).then(link => {
        const { email } = link;
        const sendTo = email;
        sendEmail(sendTo, link.link);
      }).catch(err => {
        setResponse(new HttpResponse(400, JSON.stringify(err), 'application/json'));
      });
    })
    .catch(err => {
      setResponse(new HttpResponse(200, JSON.stringify(err), 'application/json'));
    })
}
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
  createMagicLink()
}

users.where('username', 'eq', email)
	.firstOrFail()
	.then(user => {
    data.magiclink.where('email', email)
    .firstOrFail()
    .then(link => {
      const _link = link;
      updateMagicLink(_link.email);

    }).catch(err => {
      setResponse(new HttpResponse(400, JSON.stringify(err)));
    })
	})
	.catch(createUser);
