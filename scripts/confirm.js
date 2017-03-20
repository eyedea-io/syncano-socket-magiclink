const server = require('syncano-server').default;
const moment = require('moment');

const email = ARGS.email;
const status = ARGS.status;
const token = ARGS.token

const { users, data } = server();

const hasExpired = (valid_until) => {
    const now = new moment().format("HH:mm");
    const miliSeconds = moment(valid_until,"HH:mm").diff(moment(now,"HH:mm"));
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
            setResponse(new HttpResponse(200, JSON.stringify(data.status), 'application/json'));
          }).catch(err => {
            console.log(err);
          })
        } else {
          setResponse(new HttpResponse(400, JSON.stringify({message: 'Link has expired or you provided invalid Token'}), 'application/json'));
        }
      });
	}).catch(err =>{
		setResponse(new HttpResponse(400, JSON.stringify(err), 'application/json'));
	})
