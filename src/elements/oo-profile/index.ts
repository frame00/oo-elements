import { OOElement } from '../oo-element'
import { html, render } from '../../lib/html'
import getUser from '../../lib/oo-api-get-user'
import isSuccess from '../../lib/is-api-success'
import toMap from '../../lib/extensions-to-map'
import empty from '../oo-empty'
import userName from '../_atoms/oo-atoms-user-name'
import markdown from '../oo-markdown'
import define from '../../lib/define'
import weakMap from '../../lib/weak-map'

define('oo-empty', empty)
define('oo-atoms-user-name', userName)
define('oo-markdown', markdown)

const ATTR = {
	DATA_IAM: 'data-iam'
}
const EVENT = {
	USER_UPDATED: new Event('userupdated')
}

const iam = weakMap<string>()
const bio = weakMap<string>()
const found = weakMap<boolean>()

export default class extends OOElement {
	static get observedAttributes() {
		return [ATTR.DATA_IAM]
	}

	attributeChangedCallback([, prev, next]) {
		if (prev === next || !next) {
			return
		}
		iam.set(this, next)
		this.placeholder()
		this.fetchUserData()
			.then()
			.catch()
	}

	connectedCallback() {
		super.connectedCallback(false)
	}

	render() {
		const { i, f, b } = {
			i: iam.get(this),
			f: found.get(this),
			b: bio.get(this)
		}
		if (f === false) {
			return html`
			<oo-empty></oo-empty>
			`
		}
		return html`
		<style>
			@import '../../style/_vars-font-family.css';
			:host {
				display: block;
			}
			.container {
				color: #333;
			}
			p {
				margin: 0;
			}
			article {
				margin-bottom: 1rem;
			}
			header {
				margin-bottom: 1rem;
			}
		</style>
		<div class=container>
			<header>
				<oo-atoms-user-name data-iam$='${i}'></oo-atoms-user-name>
			</header>
			<oo-markdown>${b}</oo-markdown>
		</div>
		`
	}

	placeholder() {
		const template = html`
		<style>
			@import '../../style/_mixin-button-progress.css';
			main {
				padding: 1rem;
			}
			div {
				height: 2rem;
				border-radius: 10px;
				margin-bottom: 1rem;
				@mixin progress;
			}
			section {
				display: flex;
				align-items: center;
				.picture {
					width: 85px;
					height: 85px;
					border-radius: 10px;
				}
				.content {
					margin-left: 1rem;
				}
			}
			.content {
				&:last-child {
					width: 80%;
				}
			}
		</style>
		<main>
			<section>
				<div class=picture></div>
				<div class=content></div>
			</section>
			<div class=content></div>
			<div class=content></div>
			<div class=content></div>
		<main>
		`
		render(template, this)
	}

	async fetchUserData() {
		const res = await getUser(iam.get(this))
		if (isSuccess(res.status) && Array.isArray(res.response)) {
			const [item] = res.response
			const ext = toMap(item)
			found.set(this, true)
			bio.set(this, ext.get('bio'))
		} else {
			found.set(this, false)
			bio.set(this, '')
		}
		this.update()
		this.dispatchEvent(EVENT.USER_UPDATED)
	}
}
