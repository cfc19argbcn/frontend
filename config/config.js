var server = {
	name: '',
	protocol: 'http://',
	hostname : 'localhost',
	version: '0.0.1',
	env: process.env.NODE_ENV || 'development',
	port: process.env.PORT || 8081
}

var database = {
	uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/auth',
}

var jwt = {
	secret: '1tokeN&%$aXADsecret'
}

module.exports.server = server
module.exports.jwt = jwt
module.exports.database = database
