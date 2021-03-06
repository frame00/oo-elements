import { Scope } from '../type/scope'
import { SignInFlow } from '../type/sign-in-flow'
import { ReactionType } from '../type/reaction-type'

export const asScope = (d: string): Scope => {
	if (d === 'public' || d === 'private') {
		return d
	}
	return 'public'
}

export const asSignInFlow = (d: string): SignInFlow => {
	if (d === 'popup' || d === 'redirect') {
		return d
	}
	return 'popup'
}

export const asTags = (d: string): string[] => {
	if (typeof d === 'string') {
		const tags = (d || '').split(/\s|,/) || []
		return Array.from(new Set(tags))
	}
	return []
}

export const asReactionType = (d: string): ReactionType => {
	if (d === 'upvote' || d === 'join') {
		return d
	}
	return 'upvote'
}
