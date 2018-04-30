import { OOAPIResponse } from './oo-api-response'

export interface OOAPIResult<T> {
	response: OOAPIResponse<T>
	headers: Headers
	status: number
}
