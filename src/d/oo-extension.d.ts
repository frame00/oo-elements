export interface OOExtension {
	key: string,
	value: any
}

export type OOExtensions = Array<OOExtension>
export type OOExtensionsLikeObject = {
	[key: string]: any
}

export type OOExtensionMap = Map<string, any>
