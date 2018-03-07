const fs = require('fs')
const toml = require('toml')
const {send} = require('micro')

const DIR = 'src/mock'
const EXT = '.md'

module.exports = (req, res) => {
	try {
		const {url} = req
		const doc = fs.readFileSync(`${DIR}${url.replace(/\/$/, '').replace(/\?/g, '$')}${EXT}`, 'utf-8')
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
		res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9876')

		send(res, 200, body)
	} catch(err) {
		res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9876')
		if (err.message.includes('no such file or directory')) {
			send(res, 404, err)
		} else {
			send(res, 500, err)
		}
	}
}
