const rollup = require('rollup')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const typescript = require('rollup-plugin-typescript2')
const multiEntry = require('rollup-plugin-multi-entry')

const {BUILD_MODE} = process.env

const entries = [
	{
		file: 'src/index.ts',
		dest: 'oo-elements.js',
		name: 'oo-elements'
	},
	{
		file: 'src/elements/oo-button/index.ts',
		dest: 'dist/oo-button.js',
		name: 'oo-button'
	}
]
const plugins = opt => {
	let tsOpts = {}
	if (opt && opt.ts2es5) {
		tsOpts = {
			tsconfigOverride: {
				compilerOptions: {
					target: 'es5'
				}
			}
		}
	}
	return [
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
		plugins: [multiEntry()].concat(plugins())
	}, {
		format: 'umd',
		name: 'test',
		file: 'dist/test.js'
	})
}

Promise.all(entries.map(entry => {
	return build({
		input: entry.file,
		plugins: plugins()
	}, {
		format: 'umd',
		name: entry.name,
		file: entry.dest
	})
}))
Promise.all(entries.map(entry => {
	return build({
		input: entry.file,
		plugins: plugins({ts2es5: true})
	}, {
		format: 'umd',
		name: entry.name,
		file: entry.dest.replace(/\.js/, '.es5.js')
	})
}))
