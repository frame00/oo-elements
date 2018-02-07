import {html, TemplateResult} from 'lit-html'
import {MapedOOMessage} from '../../../../type/oo-message'
import define from '../../../../lib/define'
import approve from '../../../_molecules/oo-molecules-message-approve'

define('oo-molecules-message-approve', approve)

export default (mes: MapedOOMessage): TemplateResult => {
	const project = mes.ext.get('project')
	return html`
	<oo-molecules-message-approve data-project-uid$='${project}'></oo-molecules-message-approve>
	`
}
