import axios from "axios";
import { ErrorResponseType, ResponseRequest } from "../types/models/app.model";
import { UserGetDataType } from "../types/models/user.model";

export const getUserData = async (): Promise<ResponseRequest<UserGetDataType>> => {
	try {
		const data = await axios.get("https://jsonplaceholder.typicode.com/users/1", {});

		return {
			payload: data.data,
		};
	} catch (error) {
		const errorData = error as ErrorResponseType;
		return errorData;
	}
};
