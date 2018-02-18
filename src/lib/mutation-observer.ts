export const on = (node: Node, options: MutationObserverInit, callback: MutationCallback): MutationObserver => {
	const observer = new MutationObserver(callback)
	observer.observe(node, options)
	return observer
}

export const off = (observer: MutationObserver) => {
	observer.disconnect()
}
