import env from '../../env'

export const url = env === 'TEST' ? '/mock' : 'https://api.ooapp.co'
export const ext = env === 'TEST' ? '.json' : ''
