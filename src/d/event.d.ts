import {OOMessage} from './oo-message'
import {OOUserConnectStripe} from './oo-user'
import { OOAPIResponseError } from './oo-api-response';
import { OOAPIResult } from './oo-api';

export interface MessageVariationErrorDetail {
	message: 'body required'
}

export interface MessageVariationError extends CustomEvent {
	detail: MessageVariationErrorDetail
}

export interface HTMLElementEventMessageVariationError<T extends HTMLElement> extends MessageVariationError {
	target: T
}

export type MessageSentDetail = OOMessage

export interface MessageSent extends CustomEvent {
	detail: MessageSentDetail
}

export interface HTMLElementEventMessageSent<T extends HTMLElement> extends MessageSent {
	target: T
}

export type StripeConnectedDetail = OOUserConnectStripe

export interface StripeConnected extends CustomEvent {
	detail: StripeConnectedDetail
}

export interface HTMLElementEventStripeConnected<T extends HTMLElement> extends StripeConnected {
	target: T
}

export type StripeConnectionFailedDetail = any

export interface StripeConnectionFailed extends CustomEvent {
	detail: StripeConnectionFailedDetail
}

export interface HTMLElementEventStripeConnectionFailed<T extends HTMLElement> extends StripeConnectionFailed {
	target: T
}

export interface NotificationDetail {
	message: string,
	type?: 'error'
}

export interface Notification extends CustomEvent {
	detail: NotificationDetail
}

export interface DocumentNotificationEvent extends Notification {
	target: Document
}
