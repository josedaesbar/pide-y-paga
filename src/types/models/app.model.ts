export interface ErrorResponseType extends BadRequestType {}

export interface BadRequestType {
	error?: string;
	msg?: string;
	status?: string;
}

export interface SuccessResponseType<PayloadType> {
	payload?: PayloadType;
}

export type FetchStateType = "initialize" | "loading" | "success" | "error";

export type ResponseRequest<PayloadType> = SuccessResponseType<PayloadType> & BadRequestType;
