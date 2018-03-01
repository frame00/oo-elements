import {OOElement} from '../oo-element'
import {html} from '../../lib/html'
import {unsafeHTML} from 'lit-html/lib/unsafe-html'
import markdownIt from 'markdown-it'

const md = markdownIt()

export default class extends OOElement {
	constructor() {
		super()
	}

	render() {
		const markedBody = md.render(this.textContent)
		return html`
		<style>
		</style>
		<main>
			${unsafeHTML(markedBody)}
		</main>
		`
	}
}
