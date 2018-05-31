'use strict';

const loopback = require('loopback');
const boot = require('loopback-boot');
const loopbackPassport = require('loopback-component-passport');

const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');

const app = module.exports = loopback();

const PassportConfigurator = loopbackPassport.PassportConfigurator;
const passportConfigurator = new PassportConfigurator(app);

let config = {};
try {
	config = require('./providers.json');
} catch (err) {
	console.trace(err);
	process.exit(1);
}

// views
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname);

app.middleware('parse', bodyParser.json());
app.middleware('parse', bodyParser.urlencoded({extended: true}));

app.middleware('auth', loopback.token({model: app.models.accessToken}));

app.middleware('session:before', cookieParser(app.get('cookieSecret')));
app.middleware('session', session({
	secret: 'kitty',
	saveUninitialized: true,
	resave: true,
}));
passportConfigurator.init();

// We need flash messages to see passport errors
app.use(flash());

passportConfigurator.setupModels({
	userModel: app.models.user,
	userIdentityModel: app.models.userIdentity,
	userCredentialModel: app.models.userCredential,
});

for (let s in config) {
	const c = config[s];
	c.session = c.session !== false;
	passportConfigurator.configureProvider(s, c);
}

app.start = function() {
	// start the web server
	return app.listen(function() {
		app.emit('started');
		var baseUrl = app.get('url').replace(/\/$/, '');
		console.log('Web server listening at: %s', baseUrl);
		if (app.get('loopback-component-explorer')) {
			var explorerPath = app.get('loopback-component-explorer').mountPath;
			console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
		}
	});
};

if (require.main === module) {
	app.start();
}
