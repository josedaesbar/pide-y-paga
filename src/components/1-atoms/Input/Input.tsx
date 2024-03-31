import { forwardRef } from "react";
import styles from "./Input.module.scss";
import { getClassnames } from "../../../utils/getClassnames";

type InputProps = {
  placeholder: string;
  value?: string;
  disabled?: boolean;
  onChange?(data: string): void;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ placeholder, disabled = false, onChange, value }, ref) => (
    <input
      className={getClassnames([styles["container"], disabled && styles["disabled"]])}
      type="text"
      placeholder={placeholder}
      value={value}
      disabled={disabled}
      onChange={(v) => {
        if (onChange !== undefined) {
          onChange(v.target.value);
        }
      }}
      ref={ref}
    />
  ),
);
