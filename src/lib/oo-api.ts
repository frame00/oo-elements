import {OOAPIResponse, OOAPIResponseError} from '../d/oo-api-response'
import {OOAPIResource, OOAPIVersion, OOAPIRequestBody, OOAPIRequestBodyUsers, OOAPIRequestBodyPayments} from '../d/oo-apis'
import {OOAPIResult} from '../d/oo-api'
import state from './state'
import store from './local-storage'
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

export default async <T>(options: Options): Promise<OOAPIResult<T>> => {
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

	const token = state.get('token') || store.token
	if (typeof token === 'string' && token !== '') {
		init.headers = {
			Authorization: `Bearer ${token}`
		}
	}

	const result = await fetch(endpoint, init)
	const {status, headers} = result
	const response: OOAPIResponse<T> | OOAPIResponseError = await result.json()
	return {
		response,
		headers,
		status
	}
}
