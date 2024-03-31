import { useEffect, useState } from "react";
import { Text } from "../../components/1-atoms/Text";
import { Button } from "../../components/2-molecules/Button/Button";
import { ModalAddMenu } from "./components/ModalAddMenu";
import styles from "./styles.module.scss";
import axios from "axios";
import { MenuType } from "../../types/api/SaveMenu";
import { MoonLoader } from "react-spinners";
import { useAppDispatch, useAppSelector } from "../../redux";
import { A_SET_MENU, A_SET_MENU_SELECTED } from "../../redux/menus/actions";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export const Home = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const menusStore = useAppSelector((store) => store.menu);

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    getMenus();
  }, []);

  const getMenus = async () => {
    try {
      setIsLoading(true);
      const saveResponse = await axios.get("https://arustats.com/api/utils/cip/get-menus");

      console.log(saveResponse);
      dispatch(A_SET_MENU(saveResponse.data));
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      dispatch(A_SET_MENU([]));
      setIsLoading(false);
    }
  };

  const onClickMenu = (menu: MenuType) => {
    dispatch(A_SET_MENU_SELECTED(menu));

    navigate("/menu/" + menu.id);
  };

  return (
    <div className={styles["container"]}>
      <div className={styles["header"]}>
        <Text TypeText="h1" size="24" weight="medium" color="white">
          Pide y paga
        </Text>
      </div>

      <div className={styles["actions"]}>
        <Button pointer={false} bgColor="red-black">
          Menus disponibles
        </Button>

        <Button bgColor="green-light" onClick={() => setIsOpenModal(true)}>
          Subir Menú
        </Button>
      </div>

      {isLoading ? (
        <div className={styles["spinner"]}>
          <MoonLoader />
        </div>
      ) : (
        <div className={styles["menus-container"]}>
          {menusStore.menus.map((v) => {
            return (
              <Button key={uuidv4()} bgColor="red-light" color="black" onClick={() => onClickMenu(v)}>
                {v.menuName}
              </Button>
            );
          })}
        </div>
      )}

      {isOpenModal && <ModalAddMenu onClose={() => setIsOpenModal(false)} />}
    </div>
  );
};
