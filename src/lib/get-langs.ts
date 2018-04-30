const { navigator } = window

export default (): ReadonlyArray<string> => navigator.languages
