const server = require('syncano-server').default;
const moment = require('moment');
const email = ARGS.email;
const status = ARGS.status;
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
        if(!hasExpired(link.valid_until)){
          data.magiclink.update(link.id, {
            status: 'allow',
          }).then(data => {
            setResponse(new HttpResponse(200, JSON.stringify(data.status), 'application/json'));
          }).catch(err => {
            console.log(err);
          })
        } else {
          setResponse(new HttpResponse(200, JSON.stringify({message: 'Link has expired'}), 'application/json'));
        }
      });

		// if(user.token === token) {
		// 	users.update(user.id, {
		// 	status
		// 	}).then(data => {
		// 		setResponse(new HttpResponse(200, JSON.stringify(data), 'application/json'));
		// 	}).catch(err => {
		// 		setResponse(new HttpResponse(400, JSON.stringify('err')));
		// 	});
		// } else {
		// 	setResponse(new HttpResponse(200, JSON.stringify({message: 'Token has expired'}), 'application/json'));
		// }
	}).catch(err =>{
		setResponse(new HttpResponse(400, JSON.stringify(err), 'application/json'));
	})



