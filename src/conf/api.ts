const {BUILD_MODE} = process.env

export default BUILD_MODE === 'TEST' ? 'http://localhost:3000' : 'https://api.ooapp.co'
