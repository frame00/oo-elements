export default (
	name: string,
	detail: any = null,
	composed: boolean = true
): CustomEvent => {
	const init = { detail, composed }
	return new CustomEvent(name, init)
}
