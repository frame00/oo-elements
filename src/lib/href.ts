const { location } = window

const HOST_BASE = 'ooapp.co'

export const href = (path: string) => {
	if (location.host !== HOST_BASE) {
		return `//${HOST_BASE}${path}`
	}
	return path
}
