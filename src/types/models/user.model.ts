import { FetchStateType } from "./app.model";

export type DocumentType = "DNI" | "RUC";

export interface UserEntity extends UserGetDataType {
	documentType: DocumentType;
	document: string;
	phone: string;
	plate: string;
	carName: string;
}

export interface UserPlanEntity {}

export interface UserGetDataType {
	id: number;
	name: string;
	username: string;
	email: string;
	address: {
		street: string;
		suite: string;
		city: string;
		zipcode: string;
		geo: {
			lat: string;
			lng: string;
		};
	};
	phone: string;
	website: string;
	company: {
		name: string;
		catchPhrase: string;
		bs: string;
	};
}

export interface UserStore {
	user: UserEntity | null;
	stateLoadingFetch: {
		getUserState: FetchStateType;
	};
}
