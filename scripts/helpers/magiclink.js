const moment = require('moment');
const randToken = require('rand-token');

class MagicLink  {
  constructor(email, status) {
    this.token = randToken.uid(16);
    this.email = email;
    this.now = new moment().format("HH:mm");
    this.valid_until = new moment().add('15', 'minutes').format("HH:mm").toString();
  }
  getValid () {
    return this.valid_until;
  }
  hasExpired (valid_until) {
    const ms = moment(valid_until,"HH:mm").diff(moment(this.now,"HH:mm"));
    var d = moment.duration(ms);
    var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");

    if(ms <= 0) {
      return true;
    } else {
      return false;
    }
  }
  getToken() {
    return this.token;
  }
  generateNewToken() {
    this.token = randToken.uid(16);
    this.valid_until = new moment().add('15', 'minutes').format("HH:mm").toString();
    return this.token;
  }
  generateLink(instance) {
    return `https://${instance}.syncano.space/magiclink/verify/?email=${this.email}&token=${this.token}`
  }
}

module.exports = MagicLink;
