import {html, render} from '../../../lib/html'
import getUser from '../../../lib/oo-api-get-user'
import toMap from '../../../lib/extensions-to-map'

type Size = 'small' | 'medium'
interface HTMLOptions {
	iam: string,
	name: string,
	picture: string,
	size: Size
}

const ATTR = {
	DATA_IAM: 'data-iam',
	DATA_SIZE: 'data-size'
}

const iam: WeakMap<object, string> = new WeakMap()
const name: WeakMap<object, string> = new WeakMap()
const picture: WeakMap<object, string> = new WeakMap()
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
		size.set(this, asValidSize(this.getAttribute(ATTR.DATA_SIZE)))
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next) {
			return
		}
		switch(attr) {
			case ATTR.DATA_IAM:
				if (!next) {
					return
				}
				iam.set(this, next)
				this.fetchUserData()
				break
			case ATTR.DATA_SIZE:
				size.set(this, asValidSize(next))
				break
			default:
				break
		}
		this.render()
	}

	html(options: HTMLOptions) {
		const {iam: uid, name: n, picture: img, size: s} = options
		return html`
		<style>
			@import '../../../style/_vars-font-family.css';
			:host {
				display: flex;
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
			.picture {
				background-size: cover;
				background-color: whitesmoke;
				&::after {
					content: '';
					display: block;
					padding-top: 100%;
				}
			}
			header {
				a {
					display: flex;
					align-items: center;
					text-decoration: none;
					color: inherit;
				}
				&.small {
					.name {
						font-size: 1.2rem;
						line-height: 1.2rem;
						margin-left: 0.5rem;
						font-weight: 300;
					}
					.picture {
						width: 45px;
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
					.picture {
						width: 20%;
						border-radius: 10px;
					}
				}
			}
		</style>
		<header class$='${s}'>
			<a href$='/${uid}'>
				<div class=picture style$='background-image: url(${img})'></div>
				<p class$='name ${n ? '' : 'empty'}'>${n}</p>
			</a>
		</header>
		`
	}

	render() {
		const opts = {
			iam: iam.get(this),
			name: name.get(this),
			picture: picture.get(this),
			size: size.get(this)
		}
		render(this.html(opts), this)
	}

	async fetchUserData() {
		if (!iam.get(this)) {
			return
		}
		const res = await getUser(iam.get(this))
		if (Array.isArray(res.response)) {
			const [item] = res.response
			const ext = toMap(item)
			name.set(this, ext.get('name'))
			picture.set(this, ext.get('picture'))
		} else {
			name.delete(this)
			picture.delete(this)
		}
		this.render()
	}
}
