module.exports = {
	link: (email, token, status) => {
		return `https://${META.instance}.syncano.space/magiclink/verify/?email=${email}&token=${token}&status=${status}`
	}
}