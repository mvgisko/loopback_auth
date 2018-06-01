'use strict';

const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

module.exports = function(app) {
	const router = app.loopback.Router();

  // Install a `/` route that returns app status
	// router.get('/', app.loopback.status());

	router.get('/ping', (req, res) => {
  	res.send('Pong');
	});

	app.get('/', (req, res, next) => {
		res.render('pages/index', {
			user: req.user,
			url: req.url,
		});
	});

	app.get('/auth/account', ensureLoggedIn('/login'), (req, res, next) => {
		console.log(req.url);
		res.render('pages/loginProfiles', {
			user: req.user,
			url: req.url,
		});
	});

	app.get('/login', (req, res, next) => {
		res.render('pages/login', {
			user: req.user,
			url: req.url,
		});
	});

	app.get('/auth/logout', (req, res, next) => {
		req.logout();
		res.redirect('/');
	});

	app.use(router);
};
