import {html} from 'lit-html'
import render from '../../../lib/render'
import getUser from '../../../lib/oo-api-get-user'
import toMap from '../../../lib/extensions-to-map'

const ATTR = {
	DATA_IAM: 'data-iam'
}

const iam: WeakMap<object, string> = new WeakMap()
const name: WeakMap<object, string> = new WeakMap()
const photo: WeakMap<object, string> = new WeakMap()

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_IAM]
	}

	attributeChangedCallback(attr, prev, next) {
		iam.set(this, next)
		this.fetchUserData()
	}

	html(n: string, img: string) {
		return html`
		<style>
			@import '../../../style/_vars-font-family.css';
			:host {
				display: block;
			}
			p {
				margin: 0;
			}
			.name {
				font-weight: 700;
				font-size: 1.8rem;
				word-break: break-all;
				line-height: 1.8rem;
				font-family: var(--font-family);
				&.empty {
					&::after {
						content: '.';
						visibility: hidden;
					}
				}
			}
			.photo {
				background-size: cover;
				background-color: whitesmoke;
				border-radius: 10px;
				&::after {
					content: '';
					display: block;
					padding-top: 100%;
				}
			}
			header {
				display: flex;
				align-items: center;
				margin-bottom: 1rem;
				.photo {
					width: 20%;
				}
				.name {
					width: 80%;
					margin-left: 1rem;
				}
			}
		</style>
		<header>
			<div class=photo style$='background-image: url(${img})'></div>
			<p class$='name ${n ? '' : 'empty'}'>${n}</p>
		</header>
		`
	}

	render() {
		render(this.html(name.get(this), photo.get(this)), this)
	}

	async fetchUserData() {
		const res = await getUser(iam.get(this))
		if (Array.isArray(res.response)) {
			const ext = toMap(res.response)
			name.set(this, ext.get('name'))
			photo.set(this, ext.get('photo'))
		} else {
			name.delete(this)
			photo.delete(this)
		}
		this.render()
	}
}
