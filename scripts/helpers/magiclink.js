const moment = require('moment');
const randToken = require('rand-token');
const crypto = require('crypto');
class MagicLink  {
  constructor(email, status) {
    this.token = crypto.randomBytes(16).toString('hex');
    this.email = email;
    this.now = new moment().format("YYYY-MM-DD h:mm:ss a");
    this.valid_until = new moment().add('15', 'minutes').format("YYYY-MM-DD h:mm:ss a").toString();
  }
  getValid () {
    return this.valid_until;
  }
  hasExpired (valid_until) {
    const ms = moment(valid_until,"YYYY-MM-DD h:mm:ss a").diff(moment(this.now,"YYYY-MM-DD h:mm:ss a"));
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
    this.valid_until = new moment().add('15', 'minutes').format("YYYY-MM-DD h:mm:ss a").toString();
    return this.token;
  }
  generateLink(instance) {
    return `https://${instance}.syncano.space/magiclink/confirm/?email=${this.email}&token=${this.token}`
  }
}

module.exports = MagicLink;
