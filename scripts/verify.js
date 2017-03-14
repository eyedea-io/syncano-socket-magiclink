const token = ARGS.token
const email = ARGS.email;

console.log(token, email);

setResponse(new HttpResponse(200, JSON.stringify({token, email}), 'application/json'));

