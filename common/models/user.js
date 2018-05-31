/*
* @Author: Gisko Maksim
* @Date:   2018-05-31 23:39:26
* @Last Modified by:   Gisko Maksim
* @Last Modified time: 2018-06-01 00:37:29
*/
'use strict';

module.exports = function(User) {
	User.getProfile = async function(userId) {
		const user = await User.findById(userId);
		const {username, email, id} = await User.findById(userId);
		console.log(await user.identities.find());
		return {username, email, id};
	};

	User.remoteMethod(
		'getProfile',
		{
			http: {path: '/:id/getprofile', verb: 'get'},
			accepts: [{arg: 'id', type: 'string', required: true}],
			returns: {arg: 'profile', type: 'string'},
		}
	);
};
