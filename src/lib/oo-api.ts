import {OOAPIResponse, OOAPIResponseError} from '../d/oo-api-response'
import {OOAPIResource, OOAPIVersion, OOAPIRequestBody, OOAPIRequestBodyUsers, OOAPIRequestBodyPayments} from '../d/oo-apis'
import {OOAPIResult} from '../d/oo-api'
import state from './state'
import store from './local-storage'
import url from '../conf/api'
const {fetch} = window

const endpoints = (resource: OOAPIResource, pathParameter?: string, version: OOAPIVersion = 'stable'): string => {
	return `${url}/${version}/${resource}${pathParameter ? `/${pathParameter}` : ''}`
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

	try {
		const result = await fetch(endpoint, init)
		const {ok, status, headers} = result
		if (ok === false) {
			throw new Error()
		}
		const response: OOAPIResponse<T> | OOAPIResponseError = await result.json()
		return {
			response,
			headers,
			status
		}
	} catch(err) {
		console.error(err)
	}
	return {
		response: {message: ''},
		headers: new Headers(),
		status: 400
	}
}
