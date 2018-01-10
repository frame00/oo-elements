export interface AuthResult {
	user: {
		uid: string,
		displayName: string,
		photoURL: string,
		email: string,
		emailVerified: true,
		phoneNumber: null,
		isAnonymous: false,
		providerData: Array<{
			uid: string,
			displayName: string,
			photoURL: string,
			email: string,
			phoneNumber: null,
			providerId: string
		}>,
		apiKey: string,
		appName: string,
		authDomain: string,
		stsTokenManager: {
			apiKey: string,
			refreshToken: string,
			accessToken: string,
			expirationTime: number
		},
		redirectEventId: null,
		lastLoginAt: string,
		createdAt: string
	},
	credential: {
		idToken: string,
		accessToken: string,
		providerId: string
	},
	additionalUserInfo: {
		providerId: string,
		isNewUser: false,
		profile: {
			name: string,
			id: string,
			verified_email: true,
			given_name: string,
			locale: string,
			hd: string,
			family_name: string,
			email: string,
			picture: string
		}
	},
	operationType: string
}
