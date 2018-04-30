export default async time =>
	new Promise(resolve => {
		setTimeout(() => resolve(), time)
	})
