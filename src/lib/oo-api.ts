import {OOAPIResponse, OOAPIResponseError} from '../type/oo-api-response'
import {OOAPIResource, OOAPIVersion, OOAPIRequestBody, OOAPIRequestBodyUsers, OOAPIRequestBodyPayments, OOAPIRequestUsersConnectStripe} from '../type/oo-apis'
import {OOAPIResult} from '../type/oo-api'
import state from './state'
import store from './local-storage'
import {url, version as _version} from '../conf/api'
const {fetch} = window

const endpoints = (resource: OOAPIResource, pathParameter?: string, version: OOAPIVersion = _version): string => {
	return `${url}/${version}/${resource}${pathParameter ? `/${pathParameter}` : ''}`
}

interface Options {
	resource: OOAPIResource,
	pathParameter?: string,
	method?: string,
	body?: OOAPIRequestBody | OOAPIRequestBodyUsers | OOAPIRequestUsersConnectStripe | OOAPIRequestBodyPayments,
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
		const response: OOAPIResponse<T> | OOAPIResponseError = await result.json()
		if (ok === false && !response) {
			throw new Error()
		}
		return {
			response,
			headers,
			status
		}
	} catch(err) {
		console.error(err, err.stack)
	}
	return {
		response: {message: ''},
		headers: new Headers(),
		status: 400
	}
}
