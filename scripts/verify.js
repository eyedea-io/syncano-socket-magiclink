const server = require('syncano-server').default;
const moment = require('moment');

const email = ARGS.email;

const { users, data } = server();

const hasExpired = (valid_until) => {
    const now = new moment().format("YYYY-MM-DD h:mm:ss a");
    const miliSeconds = moment(valid_until,"YYYY-MM-DD h:mm:ss a").diff(moment(now,"YYYY-MM-DD h:mm:ss a"));
    var duration = moment.duration(miliSeconds);

    var s = Math.floor(duration.asHours()) + moment.utc(miliSeconds).format(":mm:ss");

    if(miliSeconds <= 0) {
      return true;
    } else {
      return false;
    }
}
users.where('username', 'eq', email)
  .firstOrFail()
  .then(user => {
    data.magiclink.where('email', email)
      .firstOrFail()
      .then(link => {
        const _link = link;
        if(_link.status === 'allow' && !hasExpired(_link.valid_until) ){
          const { user_key, id, firstname, lastname, isVolunteer, email } = user;
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
          setResponse(new HttpResponse(403, JSON.stringify({message: 'Waiting for link confirm.'}), 'application/json'));
        }
      })
    })
      .catch(err => {
        console.log(err);
    setResponse(new HttpResponse(400, JSON.stringify({status: 'false', message: 'No such user'}), 'application/json'));
  })
