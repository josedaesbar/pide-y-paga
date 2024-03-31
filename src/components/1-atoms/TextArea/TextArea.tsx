import { forwardRef } from "react";
import styles from "./TextArea.module.scss";
import { getClassnames } from "../../../utils/getClassnames";

type InputProps = {
  placeholder: string;
  value?: string;
  disabled?: boolean;
  onChange?(data: string): void;
};

export const TextArea = forwardRef<HTMLTextAreaElement, InputProps>(
  ({ placeholder, disabled = false, onChange, value }, ref) => (
    <textarea
      className={getClassnames([styles["container"], disabled && styles["disabled"]])}
      placeholder={placeholder}
      value={value}
      disabled={disabled}
      rows={3}
      onChange={(v) => {
        if (onChange !== undefined) {
          onChange(v.target.value);
        }
      }}
      ref={ref}
    />
  ),
);
