/*
* @Author: Gisko Maksim
* @Date:   2018-05-30 16:09:26
* @Last Modified by:   Gisko Maksim
* @Last Modified time: 2018-05-31 22:17:57
*/
'use strict';

module.exports = function(app) {
	app.dataSources.db.automigrate('company', function(err) {
		if (err) throw err;

		app.models.company.create([{
			title: 'HyMMA',
			ref: '59d791efc0c126f1306e1b84',
		}], function(err, company) {
			if (err) throw err;

			console.log('Models created: \n', company);
		});
	});
};
