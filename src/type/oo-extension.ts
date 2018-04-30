export interface OOExtension {
	key: string
	value: any
}

export type OOExtensions = OOExtension[]
export interface OOExtensionsLikeObject {
	[key: string]: any
}

export type OOExtensionMap = Map<string, any>
