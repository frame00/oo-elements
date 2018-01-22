const cfg = require('karma').config
const Server = require('karma').Server
const path = require('path')
const karmaConfig = cfg.parseConfig(path.resolve('./karma.conf.js'), {port: 9876})
const micro = require('micro')
const mock = require('./mock')

const mockServer = micro(mock).listen(3000)

const server = new Server(karmaConfig, exitCode => {
	mockServer.close()
	process.exit(exitCode)
})

server.start()
