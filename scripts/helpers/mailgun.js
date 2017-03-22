const request = require('request');

const api_key = CONFIG.MAILGUN_API_KEY || process.env.MAILGUN_API_KEY
const domain = CONFIG.MAILGUN_DOMAIN_NAME || process.env.MAILGUN_DOMAIN_NAME
const from = CONFIG.FROM;

const baseUrl = `https://api:${api_key}@api.mailgun.net/v3/${domain}/messages`;

module.exports = {
  sendEmail: (to, link) => {

    const message = {
    from: from,
    to: to,
    subject: 'Activation link',
    html:`
    Hello! <br /><br />

    Click the link below to confirm your registration. <br /><br />

    Follow this <a href="${link}"> link </a> to verify your email address.
    `
  }
  request.post(baseUrl, {form: message}, function(err,httpResponse,body){
    if(err) console.error(err);
    console.log(body)
  });
  }
}
