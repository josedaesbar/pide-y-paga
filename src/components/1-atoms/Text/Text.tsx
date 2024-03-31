import { FC, PropsWithChildren } from "react";
import styles from "./Text.module.scss";
import { getClassnames } from "../../../utils/getClassnames";

export type TextProps = {
  TypeText?: "p" | "span" | "h1";
  weight?: "light" | "regular" | "medium" | "bold" | "extrabold";
  size?: "10" | "12" | "14" | "16" | "18" | "20" | "22" | "24" | "26" | "28" | "30";
  color?: "white" | "black";
};

export const Text: FC<PropsWithChildren<TextProps>> = ({
  TypeText = "p",
  weight = "regular",
  size = "16",
  color = "black",

  children,
}) => {
  return (
    <TypeText className={getClassnames([styles[weight], styles["size-" + size], styles["color-" + color]])}>
      {children}
    </TypeText>
  );
};
