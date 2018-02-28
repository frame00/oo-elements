import {OOElement} from '../../oo-element'
import {html} from '../../../lib/html'
import getLangs from '../../../lib/get-langs'

const ATTR = {
	DATA_UNIXTIME: 'data-unixtime'
}

const unixtime: WeakMap<object, number> = new WeakMap()

export default class extends OOElement {
	static get observedAttributes() {
		return [ATTR.DATA_UNIXTIME]
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next || !next) {
			return
		}
		unixtime.set(this, Number(next))
		this.update()
	}

	render() {
		const UTC = 'UTC'
		let tz
		try {
			tz = new Intl.DateTimeFormat('en-US', {timeZoneName: 'long'}).resolvedOptions().timeZone
		} catch(err) {
			tz = UTC
		}
		const unix = unixtime.get(this)
		const date = new Date(unix)
		const options = {
			year: 'numeric', month: 'numeric', day: 'numeric',
			hour: 'numeric', minute: 'numeric', second: 'numeric',
			hour12: false,
			timeZone: tz
		}
		const [lang = 'en-US'] = getLangs()
		const time = new Intl.DateTimeFormat(lang, options).format(date)
		return html`
		<style>
			@import '../../../style/_vars-font-family.css';
			span {
				font-family: var(--font-family);
			}
		</style>
		<span>${time}</span>
		`
	}
}
