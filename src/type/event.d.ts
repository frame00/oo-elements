import {OOMessage} from './oo-message'
import {OOUserConnectStripe} from './oo-user'
import { OOAPIResponseError } from './oo-api-response';
import { OOAPIResult } from './oo-api';
import { Scope } from './scope';
import currency from '../conf/currency';
import { Currency } from './currency';
import { OOProject } from './oo-project';

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

export type NotificationType = 'error' | 'success'

export interface NotificationDetail {
	message: string,
	type?: NotificationType
}

export interface Notification extends CustomEvent {
	detail: NotificationDetail
}

export interface DocumentNotificationEvent extends Notification {
	target: Document
}

export interface SignedInDetail {
	uid: string,
	token: string
}

export interface SignedIn extends CustomEvent {
	detail: SignedInDetail
}

export interface HTMLElementEventSignedIn<T extends HTMLElement> extends SignedIn {
	target: T
}

export type SignedInErrorDetail = any

export interface SignedInError extends CustomEvent {
	detail: SignedInErrorDetail
}

export interface HTMLElementEventSignedInError<T extends HTMLElement> extends SignedInError {
	target: T
}

export interface ChangeScopeDetail {
	scope: Scope,
	currency: Currency
}

export interface ChangeScope extends CustomEvent {
	detail: ChangeScopeDetail
}

export interface HTMLElementEventChangeScope<T extends HTMLElement> extends ChangeScope {
	target: T
}

export interface ChangeAskDetail {
	scope: Scope,
	message: string,
	currency?: Currency
}

export interface ChangeAsk extends CustomEvent {
	detail: ChangeAskDetail
}

export interface HTMLElementEventChangeAsk<T extends HTMLElement> extends ChangeAsk {
	target: T
}

export type ProjectCreatedDetail = OOAPIResult<OOProject>

export interface ProjectCreated extends CustomEvent {
	detail: ProjectCreatedDetail
}

export interface HTMLElementEventProjectCreated<T extends HTMLElement> extends ProjectCreated {
	target: T
}
