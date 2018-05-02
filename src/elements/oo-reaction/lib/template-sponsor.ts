import { html, render } from '../../../lib/html'
import modal from '../../oo-modal'
import define from '../../../lib/define'
import OOReaction from '..'
import style from './style'

define('oo-modal', modal)

export default (el: OOReaction) => {
	const template = (open: boolean, handler: Function) => {
		return html`
		${style()}
		<label>
			<button class=sponsor on-click='${handler}'>-</button>
			sponsor
		</label>
		<oo-modal data-open$='${open ? 'enabled' : 'disabled'}' on-close='${handler}'>
			<div slot=body>hello</div>
		</oo-modal>
		`
	}
	const update = (state: boolean) => () => {
		render(template(!state, update(!state)), el)
	}
	render(template(false, update(false)), el)
}
