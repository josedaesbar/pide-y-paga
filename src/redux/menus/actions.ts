import { createAction } from "@reduxjs/toolkit";

import { MenuType } from "../../types/api/SaveMenu";

export const A_SET_MENU = createAction<MenuType[]>("menu/set-data");

export const A_SET_MENU_SELECTED = createAction<MenuType>("menu/set-selected");

// export const A_GET_USER_DATA = createAsyncThunk<ResponseRequest<UserGetDataType>>("user/get-data", async () => {
//   const response = await getUserData();

//   return response;
// });
