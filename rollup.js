const rollup = require('rollup')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const typescript = require('rollup-plugin-typescript2')
const multiEntry = require('rollup-plugin-multi-entry')
const postcss = require('rollup-plugin-transform-postcss')
const replace = require('rollup-plugin-replace')
const uglify = require('rollup-plugin-uglify')
const progress = require('rollup-plugin-progress')
const cssimport = require('postcss-import')
const cssnext = require('postcss-cssnext')
const cssnested = require('postcss-nested')
const mixins = require('postcss-mixins')
const entries = require('./entries.json')
const pkg = require('./package.json')

const {BUILD_MODE, TRAVIS_BRANCH} = process.env
const [, , name] = process.argv
const postcssOptions = {
	plugins: [cssimport, cssnested, mixins, cssnext({features: {
		rem: {replace: true}
	}})]
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
		]
	}
}
const typescriptOptions = {
	tsconfigOverride: {
		include: ['src/**/*.ts']
	}
}
const replaceOptions = {
	'process.env': JSON.stringify({BUILD_MODE, TRAVIS_BRANCH, PACKAGE_VERSION: pkg.version})
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
	replace(replaceOptions)
]

const build = async (rollupOptions, writeOptions) => {
	const bundle = await rollup.rollup({...rollupOptions, ...{
		onwarn: e => {
			if (e.message === `The 'this' keyword is equivalent to 'undefined' at the top level of an ES module, and has been rewritten`) {
				return
			}
			console.error(e)
		}
	}})
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
if (!TRAVIS_BRANCH) {
	// In this case it is local
	plugins.push(progress())
} else {
	plugins.push(uglify(uglifyOptions))
}
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
