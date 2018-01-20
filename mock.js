const fs = require('fs')
const toml = require('toml')
const {send} = require('micro')

const DIR = 'mock'
const EXT = '.md'

module.exports = (req, res) => {
	try {
		const {url} = req
		const doc = fs.readFileSync(`${DIR}${url}${EXT}`, 'utf-8')
		const [,tml = ''] = /^\+\+\+([\W\w]*)\+\+\+/.exec(doc) || []
		const [,json = {}] = /```json([\W\w]*)```/.exec(doc) || []
		const conf = toml.parse(tml)
		const body = JSON.parse(json)

		if ('headers' in conf) {
			for (const header of Object.entries(conf.headers)) {
				const [k, v] = header
				res.setHeader(k, v)
			}
		}

		send(res, 200, body)
	} catch(err) {
		send(res, 500, err)
	}
}
