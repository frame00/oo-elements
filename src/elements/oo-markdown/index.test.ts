import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'

const ELEMENT = 'oo-markdown'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	describe('Parse textContent with markdown', () => {
		it('Convert to HTML', () => {
			removeElement(ELEMENT)
			const element = document.createElement(ELEMENT)
			element.textContent = `
Line 1

Line 2
\`\`\`js
	console.log(window)
\`\`\`
			`
			document.body.appendChild(element)

			expect(element.shadowRoot.querySelector('pre.hljs code')).to.be.ok()
		})

		it('Update content when text node changes', done => {
			removeElement(ELEMENT)
			const element = document.createElement(ELEMENT)
			element.textContent = `test 1`
			document.body.appendChild(element)
			element.textContent = `test 2`

			setTimeout(() => {
				expect(element.shadowRoot.querySelector('main p').textContent).to.be(
					'test 2'
				)
				done()
			}, 100)
		})
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
