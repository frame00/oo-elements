export default (status: number): boolean => {
	return RegExp.prototype.test.call(/^2[0-9]+/, status)
}
