const {createFilter} = require('rollup-pluginutils')
const postcss = require('postcss')
const cssnext = require('postcss-cssnext')

module.exports = (options = {}) => {
	const filter = createFilter(options.include, options.exclude)
	return {
		transform(code, id) {
			if (!filter(id)) {
				return null
			}

			const styles = code.match(/(<style>((?!<\/style>)[\s\S])*<\/style>)/g)
			if (styles === null) {
				return null
			}

			const inner = styles.map(style => style.replace(/<\/?style>/g, ''))

			for(const style of inner) {
				const compiled = postcss([cssnext]).process(style).css
				code = code.replace(style, compiled)
			}

			return code
		}
	}
}
