const path = require('path');
module.exports = {
	mode: 'development',
	devtool: 'inline-source-map',
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					'to-string-loader',
					{
						loader: 'css-loader',
						options: {
							esModule: false
						}
					}
				]
			},
			{
				test: /\.(woff2|svg|webp|json)$/,
				type: 'asset/inline'
			},
			{
				test: /\.js/,
				include: /src/,
				exclude: /node_modules|\.spec\.js$/,
				use: '@jsdevtools/coverage-istanbul-loader'
			},
			{
				test: /\.csv$/i,
				use: 'raw-loader'
			}
		]
	},
	resolve: {
		alias: {
			'@chunk': path.resolve(__dirname, './test/chunkUtil')
		},
		fallback: {
			https: false,
			http: false,
			buffer: false,
			fs: false
		}
	}
};
