'use strict';

const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

module.exports = function(server) {
  // Install a `/` route that returns server status
	const router = server.loopback.Router();

	// router.get('/', server.loopback.status());

	router.get('/ping', (req, res) => {
  	res.send('Pong');
	});

	server.get('/', (req, res, next) => {
		console.log(server.models);
		res.render('pages/index', {
			user: req.user,
			url: req.url,
		});
	});

	server.get('/auth/account', ensureLoggedIn('/login'), (req, res, next) => {
		res.render('pages/loginProfiles', {
			user: req.user,
			url: req.url,
		});
	});

	server.get('/local', (req, res, next) => {
		res.render('pages/local', {
			user: req.user,
			url: req.url,
		});
	});

	server.get('/ldap', (req, res, next) => {
		res.render('pages/ldap', {
			user: req.user,
			url: req.url,
		});
	});

	server.get('/signup', (req, res, next) => {
		res.render('pages/signup', {
			user: req.user,
			url: req.url,
		});
	});

	server.post('/signup', (req, res, next) => {
		var User = server.models.user;

		var newUser = {};
		newUser.email = req.body.email.toLowerCase();
		newUser.username = req.body.username.trim();
		newUser.password = req.body.password;

		User.create(newUser, (err, user) => {
			if (err) {
				req.flash('error', err.message);
				return res.redirect('back');
			} else {
				// Passport exposes a login() function on req (also aliased as logIn())
				// that can be used to establish a login session. This function is
				// primarily used when users sign up, during which req.login() can
				// be invoked to log in the newly registered user.
				req.login(user, (err) => {
					if (err) {
						req.flash('error', err.message);
						return res.redirect('back');
					}
					return res.redirect('/auth/account');
				});
			}
		});
	});

	server.get('/login', (req, res, next) => {
		res.render('pages/login', {
			user: req.user,
			url: req.url,
		});
	});

	server.get('/auth/logout', (req, res, next) => {
		req.logout();
		res.redirect('/');
	});

	server.use(router);
};
