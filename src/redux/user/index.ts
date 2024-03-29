import { createReducer } from "@reduxjs/toolkit";
import { A_GET_USER_DATA, A_SET_USER } from "./actions";
import { UserStore } from "../../types/models/user.model";

const initialState: UserStore = {
	user: null,
	stateLoadingFetch: {
		getUserState: "initialize",
	},
};

// Reducer

const reducer = createReducer(initialState, (builder) => {
	builder
		// ACTIONS
		.addCase(A_SET_USER, (state, action) => {
			state.user = action.payload;
		})

		// ACTIONS THUNKS
		.addCase(A_GET_USER_DATA.pending, (state, action) => {
			state.stateLoadingFetch.getUserState = "loading";
		})
		.addCase(A_GET_USER_DATA.fulfilled, (state, action) => {
			state.stateLoadingFetch.getUserState = "success";
		})
		.addCase(A_GET_USER_DATA.rejected, (state, action) => {
			state.stateLoadingFetch.getUserState = "error";
		});
});

export default reducer;
