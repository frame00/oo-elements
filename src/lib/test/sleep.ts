export default time => new Promise(resolve => setTimeout(resolve, time)).catch(err => {
	console.error(err)
})
