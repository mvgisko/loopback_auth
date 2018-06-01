/*
* @Author: Gisko Maksim
* @Date:   2018-05-31 23:39:26
* @Last Modified by:   Gisko Maksim
* @Last Modified time: 2018-06-01 15:28:14
*/
'use strict';

module.exports = function(User) {
	User.getProfile = async function(userId) {
		const user = await User.findById(userId);
		const {name, country, photo, id} = await User.findById(userId);

		console.log(await user.identities.find());

		return {name, country, photo, id};
	};

	User.changeName = async function(userId, newName, cb) {
		const user = await User.findById(userId);
		if (!user) {
		  const err = new Error(`User ${userId} not found`);
		  Object.assign(err, {
		    code: 'USER_NOT_FOUND',
		    statusCode: 401,
		  });
		  return cb(err);
		}

		user.name = newName;
		await user.save();

		return cb.promise;
	};

	User.changeCountry = async function(userId, newCountry, cb) {
		const user = await User.findById(userId);
		if (!user) {
		  const err = new Error(`User ${userId} not found`);
		  Object.assign(err, {
		    code: 'USER_NOT_FOUND',
		    statusCode: 401,
		  });
		  return cb(err);
		}

		user.country = newCountry;
		await user.save();

		return cb.promise;
	};

	User.remoteMethod(
		'getProfile',
		{
			http: {path: '/:id/getprofile', verb: 'get'},
			accepts: [{arg: 'id', type: 'string', required: true}],
			returns: {arg: 'profile', type: 'string'},
		}
	);

	User.remoteMethod(
		'changeName',
		{
			description: 'Change user\'s name.',
			http: {path: '/:id/change-name', verb: 'post'},
			accepts: [
				{arg: 'id', type: 'string', required: true},
				{arg: 'newName', type: 'string', required: true, http: {source: 'form'}},
			],
		}
	);

	User.remoteMethod(
		'changeCountry',
		{
			description: 'Change user\'s country.',
			http: {path: '/:id/change-country', verb: 'post'},
			accepts: [
				{arg: 'id', type: 'string', required: true},
				{arg: 'newCountry', type: 'string', required: true, http: {source: 'form'}},
			],
		}
	);

	User.observe('before save', function updateTimestamp(ctx, next) {
		if (!ctx.isNewInstance) return next();

		// TODO: Get data from google or linkedin

		if (ctx.instance) {
			ctx.instance.name = 'myName';
			ctx.instance.photo = 'urlPhoto';
			ctx.instance.country = 'country';
		} else {
			ctx.data.name = 'myName';
			ctx.data.photo = 'urlPhoto';
			ctx.data.country = 'country';
		}

		next();
	});
};
