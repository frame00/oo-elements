import { OOExtensions, OOExtensionMap } from './oo-extension'
import { Currency } from './currency'

export interface OOMessage {
	uid: string
	created: number
	Extensions?: OOExtensions
}

export type OOMessageType = void | 'pay' | 'approve'

export interface MapedOOMessage extends OOMessage {
	ext: OOExtensionMap
}

export type MapedOOMessages = MapedOOMessage[]

export interface AllowedParametersInBody {
	type?: OOMessageType
	amount?: number
	currency?: Currency
}
