import { FC, PropsWithChildren } from "react";
import { Text } from "../../1-atoms/Text";
import styles from "./ModalEmpty.module.scss";

export type ModalEmptyProps = {
  onClose(): void;
  title: string;
};

export const ModalEmpty: FC<PropsWithChildren<ModalEmptyProps>> = ({ onClose, title, children }) => {
  return (
    <>
      <div className={styles["background"]} onClick={onClose}></div>
      <div className={styles["container"]}>
        <div className={styles["header"]}>
          <Text color="white" size="16" weight="medium">
            {title}
          </Text>
        </div>

        <div className={styles["content"]}>{children}</div>
      </div>
    </>
  );
};
