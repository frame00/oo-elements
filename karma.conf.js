process.env.CHROME_BIN = require('puppeteer').executablePath()

module.exports = function(config) {
	config.set({
		basePath: '',
		frameworks: ['mocha'],
		plugins: [
			'karma-mocha',
			'karma-mocha-reporter',
			'karma-chrome-launcher'
		],
		files: [
			{
				pattern: 'mock/**/*.json', served: true, included: false
			},
			'node_modules/expect.js/index.js',
			'dist/test.js'
		],
		proxies: {
			'/mock/': '/base/mock/'
		},
		reporters: ['mocha'],
		singleRun: true,
		customLaunchers: {
			ChromiumHeadlessConfigured: {
				base: 'ChromeHeadless',
				flags: ['--no-sandbox', '--disable-setuid-sandbox']
			}
		},
		browsers: ['ChromiumHeadlessConfigured'],
		browserConsoleLogOptions: {
			level: 'log',
			terminal: true
		}
	})
}
