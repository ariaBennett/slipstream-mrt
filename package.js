Package.describe({
	summary : "Slipstream - A light weight interface for Meteor development, supporting Meteorite"
});

Package.on_use(function (api) {
	api.use(["underscore", "ejson"], ["client", "server"]);
	api.use('router', 'client');
	api.add_files(
		[
			'lib/_inc/prototype/string.js',
			'lib/_inc/helpers.js',
			'lib/_inc/Slipstream.js',
			'lib/Slipstream.Column.js',
			'lib/Slipstream.List.js',
			'lib/Slipstream.Method.js',
			'lib/Slipstream.Router.js',
			'lib/Slipstream.Template.js',
			'lib/Slipstream.Drift.js',
		],
		[
			'client',
			'server'
		]
	);
});

Package.on_test(function (api) {
	api.use(["Slipstream.Drift", "tinytest", "test-helpers"]);
	api.add_files("lib/Slipstream.Drift.js", ["client", "server"]);
});