const rollup = require('rollup')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const typescript = require('rollup-plugin-typescript2')
const multiEntry = require('rollup-plugin-multi-entry')
const postcss = require('rollup-plugin-transform-postcss')
const replace = require('rollup-plugin-replace')
const uglify = require('rollup-plugin-uglify')
const cssnext = require('postcss-cssnext')
const precss = require('precss')
const entries = require('./entries.json')
const pkg = require('./package.json')

const {BUILD_MODE} = process.env
const [, , name] = process.argv
const postcssOptions = {
	plugins: [precss, cssnext]
}
const resolveOptions = {
	browser: true,
	jsnext: true
}
const commonjsOptions = {
	include: 'node_modules/**',
	namedExports: {
		'node_modules/firebase/index.js': [
			'app', 'apps', 'auth', 'database', 'initializeApp', 'messaging', 'storage'
		],
		'node_modules/@firebase/util/dist/cjs/index.js': [
			'deepCopy', 'deepExtend', 'createSubscribe', 'ErrorFactory', 'patchProperty'
		],
		'node_modules/toml/index.js': [
			'parse'
		]
	}
}
const typescriptOptions = {
	tsconfigOverride: {
		include: ['src/**/*.ts']
	}
}
const replaceOptions = {
	'process.env': JSON.stringify({BUILD_MODE, PACKAGE_VERSION: pkg.version})
}
const uglifyOptions = {
	output: {
		comments: (node, comment) => {
			const text = comment.value
			const type = comment.type
			if (type == 'comment2') {
				return /@preserve|@license|@cc_on|copyright/i.test(text)
			}
		}
	}
}

const plugins = [
	postcss(postcssOptions),
	resolve(resolveOptions),
	commonjs(commonjsOptions),
	typescript(typescriptOptions),
	replace(replaceOptions),
	uglify(uglifyOptions)
]

const build = async (rollupOptions, writeOptions) => {
	const bundle = await rollup.rollup(rollupOptions)
	await bundle.write(writeOptions)
}

if (BUILD_MODE === 'TEST') {
	return build({
		input: 'src/**/*.test.ts',
		plugins: [multiEntry()].concat(plugins)
	}, {
		format: 'umd',
		name: 'test',
		file: 'dist/test.js'
	})
}
const filteredEntries = name ? entries.filter(entry => entry.name === name) : entries
Promise.all(filteredEntries.map(entry => {
	return Promise.all(entry.build.map(bld => {
		return build({
			input: bld.file,
			plugins
		}, {
			name: entry.name,
			format: bld.format,
			file: bld.dest
		})
	}))
}))
