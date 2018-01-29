import {html} from 'lit-html'
import {repeat} from 'lit-html/lib/repeat'
import render from '../../lib/render'
import getUser from '../../lib/oo-api-get-user'
import isSuccess from '../../lib/is-api-success'
import toMap from '../../lib/extensions-to-map'
import lineBreak from '../../lib/line-break'

const ATTR = {
	DATA_IAM: 'data-iam'
}
const EVENT = {
	USER_UPDATED: new Event('userupdated')
}

const iam: WeakMap<object, string> = new WeakMap()
const name: WeakMap<object, string> = new WeakMap()
const picture: WeakMap<object, string> = new WeakMap()
const skill: WeakMap<object, string> = new WeakMap()

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_IAM]
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next || !next) {
			return
		}
		iam.set(this, next)
		this.fetchUserData()
	}

	html(n: string, p: string, s: string) {
		const img = p ? p : ''
		const skills = lineBreak(s)
		return html`
		<style>
			@import '../../style/_vars-font-family.css';
			@import '../../style/_mixin-heading.css';
			:host {
				display: block;
			}
			.container {
				color: #333;
			}
			p {
				margin: 0;
			}
			.name,
			.skills {
				font-family: var(--font-family);
			}
			.name {
				font-weight: 700;
				font-size: 1.8rem;
				word-break: break-all;
				line-height: 1.8rem;
				&.empty {
					&::after {
						content: '.';
						visibility: hidden;
					}
				}
			}
			.skills {
				p {
					margin-bottom: 1rem;
					font-size: 1rem;
					line-height: 1.4rem;
				}
			}
			.picture {
				background-size: cover;
				background-color: whitesmoke;
				border-radius: 10px;
				&::after {
					content: '';
					display: block;
					padding-top: 100%;
				}
			}
			.heading {
				@mixin heading;
			}
			header {
				display: flex;
				align-items: center;
				margin-bottom: 1rem;
				.picture {
					width: 20%;
				}
				.name {
					width: 80%;
					margin-left: 1rem;
				}
			}
		</style>
		<div class=container>
			<header>
				<div class=picture style$='background-image: url(${img})'></div>
				<p class$='name ${n ? '' : 'empty'}'>${n}</p>
			</header>
			<div class=skills>
				<div class=heading>What I can do</div>
				${repeat(skills, sk => html`<p>${sk}</p>`)}
			</div>
		</div>
		`
	}

	render() {
		render(this.html(name.get(this), picture.get(this), skill.get(this)), this)
	}

	async fetchUserData() {
		const res = await getUser(iam.get(this))
		if (isSuccess(res.status) && Array.isArray(res.response)) {
			const [item] = res.response
			const ext = toMap(item)
			name.set(this, ext.get('name'))
			picture.set(this, ext.get('picture'))
			skill.set(this, ext.get('skill'))
			this.render()
		} else {
			name.set(this, '')
			picture.set(this, '')
			skill.set(this, '')
			this.render()
		}
		this.dispatchEvent(EVENT.USER_UPDATED)
	}
}
