import {html, render} from 'lit-html'

const {PACKAGE_VERSION: version} = process.env

export default class extends HTMLElement {
	connectedCallback() {
		this.render()
	}

	html(v: string) {
		return html`
		<span>${v}</span>
		`
	}

	render() {
		render(this.html(version), this)
	}
}
