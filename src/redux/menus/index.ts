import { createReducer } from "@reduxjs/toolkit";
import { MenusStore } from "../../types/models/menus.model";
import { A_SET_MENU, A_SET_MENU_SELECTED } from "./actions";

const initialState: MenusStore = {
  menus: [],
  menuSelected: null,
};

// Reducer

const reducer = createReducer(initialState, (builder) => {
  builder
    // ACTIONS
    .addCase(A_SET_MENU, (state, action) => {
      state.menus = action.payload;
    })
    .addCase(A_SET_MENU_SELECTED, (state, action) => {
      state.menuSelected = action.payload;
    });

  // ACTIONS THUNKS
  // .addCase(A_GET_USER_DATA.pending, (state, action) => {
  //   state.stateLoadingFetch.getUserState = "loading";
  // })
  // .addCase(A_GET_USER_DATA.fulfilled, (state, action) => {
  //   state.stateLoadingFetch.getUserState = "success";
  // })
  // .addCase(A_GET_USER_DATA.rejected, (state, action) => {
  //   state.stateLoadingFetch.getUserState = "error";
  // });
});

export default reducer;
