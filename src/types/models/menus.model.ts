import { MenuType } from "../api/SaveMenu";

export interface MenusStore {
  menus: MenuType[];
  menuSelected: MenuType | null;
}
