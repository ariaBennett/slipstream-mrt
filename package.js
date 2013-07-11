Package.describe({
	summary : "Slipstream - A light weight interface for Meteor development, supporting Meteorite"
});

Package.on_use(function (api) {
	api.use(
		[
			"underscore",
			"ejson"
		],
		[
			"client",
			"server"
		]);
	api.use('router', 'client');
	api.add_files(
		[
			'lib/_inc/handlebars/handlebars.js',
		],
		[
			'client',
		]
	);
	api.add_files(
		[
			'lib/_inc/prototype/string.js',
			'lib/_inc/underscore/underscore.js',
		],
		[
			'client',
			'server'
		]
	);
	api.add_files(
		[
			'lib/_inc/Slipstream.js',
			'lib/_inc/Slipstream.error.js',
			'lib/_inc/Slipstream.log.js',
		],
		[
			'client',
			'server'
		]
	);
	api.add_files(
		[
			'lib/client/Slipstream.Session.js',
			'lib/client/Slipstream.Router.js',
			'lib/client/Slipstream.Template.js',
		],
		[
			'client'
		]
	);
	api.add_files(
		[
			'lib/collection/Slipstream.Column.js',
			'lib/collection/Slipstream.CollectionSetup.js',
			'lib/collection/Slipstream.Collection.js',
			'lib/server/Slipstream.Method.js',
			'lib/Slipstream.Drift.js',
		],
		[
			'client',
			'server'
		]
	);
});

Package.on_test(function (api) {
	api.use(
		[
			"underscore",
			"underscore-string",
			"ejson"
		],
		[
			"client",
			"server"
		]);
	api.use('router', 'client');
	api.use(
		[
			'slipstream',
			'tinytest',
			'test-helpers'
		],
		[
			'client',
			'server'
		]);
	api.add_files('test/slipstream-test.js',
		[
			'client',
			'server'
		]);
});
