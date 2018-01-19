import { OOMessage } from "./oo-message";


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

