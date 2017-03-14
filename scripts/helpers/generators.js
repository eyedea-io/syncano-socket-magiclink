module.exports = {
	link: (email, token) => {
		return `https://${META['api_host']}/v2/instances/${META.instance}/endpoints/sockets/magiclink/verify/?email=${email}&token=${token}`
	}
}