const { BUILD_MODE, TRAVIS_BRANCH = false } = process.env

export const url =
	BUILD_MODE === 'TEST' ? 'http://localhost:3000' : 'https://api.ooapp.co'
export const version = TRAVIS_BRANCH || BUILD_MODE === 'TEST' ? 'stable' : 'dev'
