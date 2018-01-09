const rollup = require('rollup')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const typescript = require('rollup-plugin-typescript2')
const multiEntry = require('rollup-plugin-multi-entry')
const postcss = require('rollup-plugin-transform-postcss')
const cssnext = require('postcss-cssnext')
const precss = require('precss')
const entries = require('./entries.json')

const {BUILD_MODE} = process.env

const plugins = opt => {
	let tsOpts = {tsconfigOverride: {}}
	if (opt && opt.ts2es5) {
		tsOpts.tsconfigOverride.compilerOptions = {
			target: 'es5'
		}
	}
	if (opt && opt.includeAll) {
		tsOpts.tsconfigOverride.include = ['src/**/*.ts']
	}
	return [
		postcss({
			plugins: [precss, cssnext]
		}),
		typescript(tsOpts),
		resolve({jsnext: true}),
		commonjs()
	]
}

const build = async (rollupOptions, writeOptions) => {
	const bundle = await rollup.rollup(rollupOptions)
	await bundle.write(writeOptions)
}

if (BUILD_MODE === 'TEST') {
	return build({
		input: 'src/**/*.test.ts',
		plugins: [multiEntry()].concat(plugins({includeAll: true}))
	}, {
		format: 'umd',
		name: 'test',
		file: 'dist/test.js'
	})
}

Promise.all(entries.map(entry => {
	return build({
		input: entry.file,
		plugins: plugins({includeAll: true})
	}, {
		format: 'umd',
		name: entry.name,
		file: entry.dest
	})
}))
Promise.all(entries.map(entry => {
	return build({
		input: entry.file,
		plugins: plugins({ts2es5: true, includeAll: true})
	}, {
		format: 'umd',
		name: entry.name,
		file: entry.dest.replace(/\.js/, '.es5.js')
	})
}))
