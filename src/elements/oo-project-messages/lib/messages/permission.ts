import {html, TemplateResult} from 'lit-html'
import {MapedOOMessage} from '../../../../type/oo-message'
import define from '../../../../lib/define'
import permission from '../../../_molecules/oo-molecules-message-permission'

define('oo-molecules-message-permission', permission)

export default (mes: MapedOOMessage): TemplateResult => {
	const project = mes.ext.get('project')
	return html`
	<oo-molecules-message-permission data-project-uid$='${project}'></oo-molecules-message-permission>
	`
}
