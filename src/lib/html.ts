import {html as _html, render as _render} from 'lit-html/lib/lit-extended'
import {TemplateResult} from 'lit-html'

export const render = (template: TemplateResult, component: Element): void => {
	return _render(template, component.shadowRoot || component.attachShadow({mode: 'open'}))
}

export const html = _html
