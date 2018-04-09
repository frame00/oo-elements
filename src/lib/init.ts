import stop from './stop-when-unsupported'
import define from './define'
import unsupported from './unsupported-banner'

export default (elementName: string, el: Function) => {
	if (stop() === false) {
		define(elementName, el)
	} else {
		unsupported(elementName)
	}
}
