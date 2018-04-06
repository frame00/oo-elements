import {OOElement} from '../oo-element'
import {html} from '../../lib/html'
import {unsafeHTML} from 'lit-html/lib/unsafe-html'
import markdownIt from 'markdown-it'
import hljs from 'highlight.js'
import weakMap from '../../lib/weak-map'

const md = markdownIt({
	linkify: true,
	highlight(str, lang) {
		if (lang && hljs.getLanguage(lang)) {
			try {
				return `<pre class=hljs><code>${hljs.highlight(lang, str, true).value}</code></pre>`
			} catch (err) {
				// Empty
			}
		}
		return `<pre class=hljs><code>${md.utils.escapeHtml(str)}</code></pre>`
	}
})

const stateObserver = weakMap<MutationObserver>()

export default class extends OOElement {
	connectedCallback() {
		super.connectedCallback()
		const observer = new MutationObserver(() => {
			if (this.connected) {
				this.update()
			}
		})
		observer.observe(this, {characterData: true, childList: true})
		stateObserver.set(this, observer)
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		const observer = stateObserver.get(this)
		if (observer) {
			observer.disconnect()
			stateObserver.delete(this)
		}
	}

	render() {
		const markedBody = md.render(this.textContent)
		return html`
		<style>
			@import '../../style/_vars-font-family.css';
			@import '../../../node_modules/highlight.js/styles/atom-one-dark.css';
			:host {
				display: block;
			}
			main {
				font-family: var(--font-family);
			}
			h1,h2,h3,h4,h5,h6 {
				font-weight: 400;
			}
			img {
				display: block;
				margin: auto;
				max-width: 100%;
			}
			a {
				color: inherit;
			}
			code {
				background: #00000011;
				padding: 0.2rem 0.4rem;
				border-radius: 3px;
			}
			pre {
				&.hljs {
					padding: 1.5rem;
					border-radius: 5px;
				}
				code {
					background: none;
					padding: 0;
					border-radius: 0;
				}
			}
		</style>
		<main>
			${unsafeHTML(markedBody)}
		</main>
		`
	}
}
