import { OOElement } from '../../oo-element'
import { html } from '../../../lib/html'
import weakMap from '../../../lib/weak-map'
import userName from '../../_atoms/oo-atoms-user-name'
import define from '../../../lib/define'

define('oo-atoms-user-name', userName)

const ATTR = {
	DATA_AUTHOR: 'data-author',
	DATA_ASSIGNEE: 'data-assignee'
}

const stateAuthor = weakMap<string>()
const stateAssignee = weakMap<string>()

const content = (uid?: string) =>
	uid
		? html`<oo-atoms-user-name data-iam$='${uid}' data-size=small></oo-atoms-user-name>`
		: html``

export default class extends OOElement {
	static get observedAttributes() {
		return [ATTR.DATA_AUTHOR, ATTR.DATA_ASSIGNEE]
	}

	attributeChangedCallback(attr, prev, next: string) {
		if (prev === next && !next) {
			return
		}
		switch (attr) {
			case ATTR.DATA_AUTHOR:
				stateAuthor.set(this, next)
				break
			case ATTR.DATA_ASSIGNEE:
				stateAssignee.set(this, next)
				break
			default:
		}
		if (this.connected) {
			this.update()
		}
	}

	render() {
		const author = stateAuthor.get(this)
		const assignee = stateAssignee.get(this)

		return html`
		<style>
			:host {
				display: block;
			}
			div {
				display: flex;
			}
			oo-atoms-user-name {
				&:not(:first-child) {
					margin-left: 1rem;
				}
				&:first-child:not(:only-child) {
					&::after {
						content: 'to';
						align-self: center;
						margin-left: 1rem;
					}
				}
			}
		</style>
		<div>
			${content(author)}
			${content(assignee)}
		</div>
		`
	}
}
