import {OOExtensions} from './oo-extension'

export interface OOProject {
	uid: string,
	created: number,
	Extensions?: OOExtensions
}

export type ProjectType = 'post' | 'ask' | 'skill'
