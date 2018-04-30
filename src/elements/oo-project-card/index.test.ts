import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'
import sleep from '../../lib/test/sleep'
import slot from '../../lib/test/query-slot-selector'

const ELEMENT = 'oo-project-card'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	describe('Fetch project data', () => {
		it('Display project data of UID specified by "data-uid" attribute', async () => {
			const element = insertElement(
				ELEMENT,
				new Map([['data-uid', '79zGMA1b6q']])
			)
			await sleep(300)
			const a = element.shadowRoot.querySelector('a')
			// tslint:disable-next-line:no-http-string
			expect(a.href).to.be('http://ooapp.co/project/79zGMA1b6q')
		})

		it('Show <oo-empty> when no project exists', async () => {
			const element = insertElement(ELEMENT, new Map([['data-uid', 'xxx']]))
			await sleep(300)
			expect(element.shadowRoot.querySelector('oo-empty')).to.be.ok()
		})
	})

	describe('Body collapse', () => {
		it('If the body is short, body is not collapsed', async () => {
			const element = insertElement(
				ELEMENT,
				new Map([['data-uid', '79zGMA1b6q']])
			)
			await sleep(300)
			const body = slot(element, 'oo-atoms-message', 'slot[name=body]', '.body')
			const button = slot(
				element,
				'oo-atoms-message',
				'slot[name=body]',
				'button'
			)
			expect(body.classList.toString()).to.not.contain('collapse')
			expect(button.clientHeight).to.be(0)
		})

		it('If the body is long, body is collapsed', async () => {
			const element = insertElement(
				ELEMENT,
				new Map([['data-uid', 'a2C5nnKDu6']])
			)
			await sleep(300)
			const body = slot(element, 'oo-atoms-message', 'slot[name=body]', '.body')
			const button = slot(
				element,
				'oo-atoms-message',
				'slot[name=body]',
				'button'
			)
			expect(body.classList.toString()).to.contain('collapse')
			expect(button.clientHeight).to.be.above(0)
		})
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
