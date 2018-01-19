export interface MessageVariationErrorDetail {
	message: 'body required'
}

export interface MessageVariationError extends CustomEvent {
	detail: MessageVariationErrorDetail
}

export interface HTMLElementEventMessageVariationError<T extends HTMLElement> extends MessageVariationError {
	target: T
}
