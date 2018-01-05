const rollup = require('rollup')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const typescript = require('rollup-plugin-typescript2')

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

const build = async (rollupOptions, writeOptions) => {
	const bundle = await rollup.rollup(rollupOptions)
	await bundle.write(writeOptions)
}

Promise.all(entries.map(entry => {
	return build({
		input: entry.file,
		plugins: [
			typescript(),
			resolve({jsnext: true}),
			commonjs()
		]
	}, {
		format: 'umd',
		name: entry.name,
		file: entry.dest
	})
}))
