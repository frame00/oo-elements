export interface OOAPIResponseError {
	message: string
	[key: string]: any
}

export type OOAPIResponse<T> = T[] | OOAPIResponseError
