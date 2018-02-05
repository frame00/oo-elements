const {TRAVIS_BRANCH = false} = process.env

export const cdn = 'https://checkout.stripe.com/checkout.js'
export const publicKey = TRAVIS_BRANCH ? 'pk_live_9gWUVVpr9UGIaclVD8PwAIQj' : 'pk_test_mhnxgwHlCHhDGe0GIzTUNDAf'
export const oAuthUrl = 'https://dashboard.stripe.com/oauth/authorize?response_type=code&client_id=ca_CGWAAnRV1DMThelEegomOo1sdFb96lDD&scope=read_write'
