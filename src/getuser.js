const server = require('syncano-server').default;
const { users } = server();
const email = ARGS.email;
const userKey = ARGS.userkey;
console.log(userKey);
users.list().then(user => {
  user.forEach(account => {
    if (account.user_key === userKey) {
      const { user_key, id, firstname, lastname, isVolunteer, email } = account;
      const userData = {
        userKey: user_key,
        id,
        firstname,
        lastname,
        isVolunteer,
        email
      }
      setResponse(new HttpResponse(201, JSON.stringify({status: 'true', userData }), 'application/json'));
    } else {
      setResponse(new HttpResponse(401, JSON.stringify({status: 'false', message: 'No such user' }), 'application/json'));
    }
  });
}).catch(err => {
  console.log(err);
});
