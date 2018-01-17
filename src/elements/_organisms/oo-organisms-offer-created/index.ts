import {html} from 'lit-html'
import render from '../../../lib/render'

const ATTR = {
	DATA_PROJECT_UID: 'data-project-uid'
}

const projectUid: WeakMap<object, string> = new WeakMap()

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_PROJECT_UID]
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next) {
			return
		}
		projectUid.set(this, next)
		this.render()
	}

	html(uid: string) {
		return html`
		<style>
			@import '../../../style/_vars-font-family.css';
			:host {
				display: block;
				height: 100%;
			}
			main {
				display: flex;
				height: 100%;
				font-family: var(--font-family);
				align-items: center;
				flex-direction: column;
				justify-content: center;
			}
			a {
				text-decoration: none;
				color: inherit;
			}
			.project {
				font-size: 2rem;
			}
			.profile {}
		</style>
		<main>
			<p class=project>
				<a href$='https://ooapp.co/project/${uid}' target=_blank rel=noopener>Created Offer</a>
			</p>
			<p class=profile>
				<a href='https://ooapp.co/dashboard' target=_blank rel=noopener>View your profile</a>
			</p>
		</main>
		`
	}

	render() {
		render(this.html(projectUid.get(this)), this)
	}
}
