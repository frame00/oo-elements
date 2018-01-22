import { OOUserUID } from "./oo-user";

export interface MessageOptionsPost {
	users?: Array<OOUserUID>,
	body: string,
	author?: OOUserUID,
	project?: string
}
