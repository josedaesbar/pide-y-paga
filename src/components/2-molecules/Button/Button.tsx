import { getClassnames } from "../../../utils/getClassnames";
import { Text, TextProps } from "../../1-atoms/Text";
import styles from "./Button.module.scss";
import { FC, PropsWithChildren } from "react";

type ButtonProps = TextProps & {
  bgColor: "green-light" | "red" | "red-black" | "red-light" | "blue-light-1";
  onClick?(): void;
  disabled?: boolean;
  pointer?: boolean;
};

export const Button: FC<PropsWithChildren<ButtonProps>> = ({
  bgColor,
  onClick,
  pointer = true,
  TypeText = "span",
  color = "white",
  size = "18",
  weight = "bold",
  disabled = false,
  children,
}) => {
  return (
    <button
      className={getClassnames([
        styles["container"],
        styles[bgColor],
        pointer && styles["cursor-pointer"],
        disabled && styles["disabled"],
      ])}
      onClick={() => {
        if (disabled) return;
        if (onClick) {
          onClick();
        }
      }}
    >
      <Text TypeText={TypeText} weight={weight} color={color} size={size}>
        {children}
      </Text>
    </button>
  );
};
