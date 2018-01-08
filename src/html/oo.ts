import {html, TemplateResult} from 'lit-html'

export default (size: 'small' | 'medium'): TemplateResult => {
	size = size || 'medium'
	return html`
	<style>
		.container {
			display: flex;
			align-items: center;
		    justify-content: center;
			background: black;
		}
		.medium {
			height: 50px;
			width: 50px;
		}
		.circle {
			border: 2px solid white;
			border-radius: 50%;
		}
		.left {
		}
	</style>
	<div class$='container ${size}'>
		<div class='circle left'></div>
		<div class='circle right'></div>
	</div>
	`
}
