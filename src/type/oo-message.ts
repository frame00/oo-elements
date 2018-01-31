import {OOExtensions, OOExtensionMap} from './oo-extension'
import {Currency} from './currency'

export interface OOMessage {
	uid: string,
	created: number,
	Extensions?: OOExtensions
}

export type OOMessageType = void | 'pay' | 'permission'

export interface MapedOOMessage extends OOMessage {
	ext: OOExtensionMap
}

export type MapedOOMessages = Array<MapedOOMessage>

export interface AllowedParametersInBody {
	type?: OOMessageType,
	amount?: number,
	currency?: Currency
}
