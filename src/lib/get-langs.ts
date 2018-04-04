const {navigator} = window

export default (): ReadonlyArray<string> => {
	const {languages} = navigator
	return languages
}
