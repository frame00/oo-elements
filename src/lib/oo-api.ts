import {OOAPIResponse, OOAPIResponseError} from '../d/oo-api-response'
import {OOAPIResource, OOAPIVersion, OOAPIRequestBody, OOAPIRequestBodyUsers, OOAPIRequestBodyPayments} from '../d/oo-apis'
import {OOAPIResult} from '../d/oo-api'
import state from './state'
const {fetch} = window

const ENDPOINT = 'https://api.ooapp.co'

const endpoints = (resource: OOAPIResource, pathParameter?: string, version: OOAPIVersion = 'stable'): string => {
	return `${ENDPOINT}/${version}/${resource}${pathParameter ? `/${pathParameter}` : ''}`
}

interface Options {
	resource: OOAPIResource,
	pathParameter?: string,
	method?: string,
	body?: OOAPIRequestBody | OOAPIRequestBodyUsers | OOAPIRequestBodyPayments,
	version?: OOAPIVersion
}

export default async (options: Options): Promise<OOAPIResult> => {
	const {
		resource,
		pathParameter,
		method = 'GET',
		body,
		version
	} = options

	const endpoint = endpoints(resource, pathParameter, version)
	const init: RequestInit = {
		method,
		mode: 'cors'
	}

	if (body !== undefined) {
		init.body = JSON.stringify(body)
	}

	const token = state.get('token')
	if (typeof token === 'string' && token !== '') {
		init.headers = {
			Authorization: `Bearer ${token}`
		}
	}

	const result = await fetch(endpoint, init)
	const {status} = result
	const response: OOAPIResponse | OOAPIResponseError = await result.json()
	return {
		response,
		status
	}
}
