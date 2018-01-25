import {OOExtensions, OOExtensionMap} from './oo-extension'

export interface OOMessage {
	uid: string,
	created: number,
	Extensions?: OOExtensions
}

export type OOMessageType = void | 'pay'

export interface MapedOOMessage extends OOMessage {
	ext: OOExtensionMap
}

export type MapedOOMessages = Array<MapedOOMessage>
