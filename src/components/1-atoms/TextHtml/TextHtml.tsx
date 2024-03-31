import { FC, PropsWithChildren } from "react";
import styles from "./TextHtml.module.scss";
import { getClassnames } from "../../../utils/getClassnames";

export type TextProps = {
  TypeText?: "p" | "span" | "h1";
  weight?: "light" | "regular" | "medium" | "bold" | "extrabold";
  size?: "10" | "12" | "14" | "16" | "18" | "20" | "22" | "24" | "26" | "28" | "30";
  color?: "white" | "black";
  html?: string;
};

export const TextHtml = ({
  TypeText = "p",
  weight = "regular",
  size = "16",
  color = "black",
  html = "",
}: TextProps) => {
  return (
    <TypeText
      className={getClassnames([styles[weight], styles["size-" + size], styles["color-" + color]])}
      dangerouslySetInnerHTML={{ __html: html }}
    ></TypeText>
  );
};
