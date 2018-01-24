import {OOUserUID} from './oo-user'
import {OOExtensions} from './oo-extension'

export type OOAPIVersion = 'stable' | 'unstable'

export type OOAPIResource = 'users' | 'projects' | 'messages' | 'payments' | 'permalinks'

export interface OOAPIRequestBodyUsers {
	firebase_uid?: string,
	Extensions?: OOExtensions
}

export interface OOAPIRequestUsersConnectStripe {
	code: string
}

export interface OOAPIRequestBodyPayments {
	stripe_token: string,
	amount: number,
	currency: string,
	seller_uid: OOUserUID,
	linked_message_uid: OOUserUID,
	Extensions?: OOExtensions
}

export interface OOAPIRequestBody {
	Extensions?: OOExtensions
}

