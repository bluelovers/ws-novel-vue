const production = process.env.NODE_ENV === 'production';

module.exports = {

	publicPath: './',
	/*
	configureWebpack: {

		//plugins: [],

	},
	*/
	css: {
		modules: true,
		sourceMap: true,
	},
	devServer: {
		disableHostCheck: true,
		before()
		{
			//return require('./script/fetch-api-json')
		},
		clientLogLevel: 'error',
	},

};
