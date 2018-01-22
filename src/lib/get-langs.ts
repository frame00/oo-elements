const {navigator} = window

export default (): Array<string> => {
	const {languages} = navigator
	return languages
}
