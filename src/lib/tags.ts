import {html} from './html'
import {repeat} from 'lit-html/lib/repeat'

interface Options {
	className?: string
}

export const template = (tags: Array<string>, opts?: Options) => {
	const {className = 'tags'} = opts || {}
	return html`<div class$='${className}'>${repeat(tags, tag => html`<span><a href$='/projects/tag/${tag}'>${tag}</a></span>`)}</div>`
}
