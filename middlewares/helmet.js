import helmet from 'helmet';

const myHelmet = helmet({
	contentSecurityPolicy: {
		directives: {
			...helmet.contentSecurityPolicy.getDefaultDirectives(),
			'script-src': ['\'self\'', '\'unsafe-inline\''],
		},
	},
});

export default myHelmet;
