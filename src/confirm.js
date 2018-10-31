const server = require('syncano-server').default;
const moment = require('moment');

const email = ARGS.email;
const status = ARGS.status;
const token = ARGS.token

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
        if(!hasExpired(_link.valid_until) && token === _link.token){
          data.magiclink.update(_link.id, {
            status: 'allow',
          }).then(data => {
            setResponse(new HttpResponse(200, 'Logged in, you can close this window now.', 'application/json'));
          }).catch(err => {
            console.log(err);
          })
        } else {
          setResponse(new HttpResponse(400,
            JSON.stringify({status: 'false', message: 'Link has expired or you provided invalid token'}),
            'application/json'));
        }
      });
	}).catch(err =>{
		setResponse(new HttpResponse(400, JSON.stringify(err), 'application/json'));
	})
