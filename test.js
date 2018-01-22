const cfg = require('karma').config
const Server = require('karma').Server
const childProcess = require('child_process')
const path = require('path')
const karmaConfig = cfg.parseConfig(path.resolve('./karma.conf.js'), {port: 9876})
const mock = childProcess.exec('npm run mock')

const server = new Server(karmaConfig, exitCode => {
	process.exit(exitCode)
	childProcess.exec(`kill ${mock.pid}`)
})

server.start()
