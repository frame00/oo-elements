process.env.CHROME_BIN = require('puppeteer').executablePath()

module.exports = function(config) {
	config.set({
		basePath: '',
		frameworks: ['mocha'],
		plugins: [
			'karma-mocha',
			'karma-mocha-reporter',
			'karma-chrome-launcher',
			'karma-typescript-preprocessor'
		],
		files: [
			'node_modules/expect.js/index.js',
			'src/**/*.test.ts'
		],
		preprocessors: {
			'**/*.ts': ['typescript']
		},
		reporters: ['mocha'],
		singleRun: true,
		customLaunchers: {
			ChromiumHeadlessConfigured: {
				base: 'ChromeHeadless',
				flags: ['--no-sandbox', '--disable-setuid-sandbox']
			}
		},
		browsers: ['ChromiumHeadlessConfigured']
	})
}
