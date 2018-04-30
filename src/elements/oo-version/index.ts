import { html, render } from 'lit-html'

const { PACKAGE_VERSION: version } = process.env

export default class extends HTMLElement {
	connectedCallback() {
		this.render()
	}

	render() {
		render(
			html`
		<span>${version}</span>
		`,
			this
		)
	}
}
