import {html} from 'lit-html'
import render from '../../../lib/render'
import getUser from '../../../lib/oo-api-get-user'
import toMap from '../../../lib/extensions-to-map'

type Size = 'small' | 'medium'

const ATTR = {
	DATA_IAM: 'data-iam',
	DATA_SIZE: 'data-size'
}

const iam: WeakMap<object, string> = new WeakMap()
const name: WeakMap<object, string> = new WeakMap()
const photo: WeakMap<object, string> = new WeakMap()
const size: WeakMap<object, Size> = new WeakMap()

const asValidSize = (data: string): Size => {
	if(data === 'small' || data === 'medium') {
		return data
	}
	return 'medium'
}

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_IAM, ATTR.DATA_SIZE]
	}

	constructor() {
		super()
		this.render()
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next) {
			return
		}
		switch(attr) {
			case ATTR.DATA_IAM:
				iam.set(this, next)
				break
			case ATTR.DATA_SIZE:
				size.set(this, asValidSize(next))
				break
			default:
				break
		}
		this.fetchUserData()
	}

	html(uid: string, n: string, img: string, s: Size) {
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
				word-break: break-all;
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
				&::after {
					content: '';
					display: block;
					padding-top: 100%;
				}
			}
			header {
				margin-bottom: 1rem;
				a {
					display: flex;
					align-items: center;
					text-decoration: none;
					color: inherit;
				}
				&.small {
					.name {
						width: 90%;
						font-size: 1.2rem;
						line-height: 1.2rem;
						margin-left: 0.5rem;
						font-weight: 300;
					}
					.photo {
						width: 10%;
						border-radius: 5px;
					}
				}
				&.medium {
					.name {
						width: 80%;
						font-size: 1.8rem;
						line-height: 1.8rem;
						margin-left: 1rem;
						font-weight: 700;
					}
					.photo {
						width: 20%;
						border-radius: 10px;
					}
				}
			}
		</style>
		<header class$='${s}'>
			<a href$='https://ooapp.co/${uid}'>
				<div class=photo style$='background-image: url(${img})'></div>
				<p class$='name ${n ? '' : 'empty'}'>${n}</p>
			</a>
		</header>
		`
	}

	render() {
		render(this.html(iam.get(this), name.get(this), photo.get(this), size.get(this)), this)
	}

	async fetchUserData() {
		if (!iam.get(this)) {
			return
		}
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
