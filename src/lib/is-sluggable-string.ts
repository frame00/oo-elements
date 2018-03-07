import {Key as k} from 'ts-keycode-enum'

const keys: Array<number> = [k.Zero, k.One, k.Two, k.Three, k.Four, k.Five, k.Six, k.Seven, k.Eight, k.Nine,
	k.A, k.B, k.C, k.D, k.E, k.F, k.G, k.H, k.I, k.J, k.K, k.L, k.M, k.N, k.O, k.P, k.Q, k.R, k.S, k.T, k.U, k.V, k.W, k.X, k.Y, k.Z]

export default (keyCode: number, shift: boolean = false): boolean => {
	let valid = keys.some(i => i === keyCode)
	if (shift && keyCode === k.UnderScore) {
		valid = true
	}
	return valid
}
