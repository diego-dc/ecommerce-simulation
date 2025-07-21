// Input.tsx
import React from "react";
import InputField from "./InputField";
import Label from "./Label";
import Status from "./Status";

interface InputProps {
  label: string;
  type?: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string | null;
  tooltipMessage?: string;
  leftIcon?: string;
  rightIcon?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  type = "text",
  id,
  name,
  value,
  onChange,
  placeholder,
  error,
  tooltipMessage,
  leftIcon,
  rightIcon,
}) => {
  const isInvalid = !!error;

  return (
    <div className="flex flex-col w-full gap-xs">
      <Label htmlFor={id} text={label} tooltipMessage={tooltipMessage} />
      <InputField
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        isInvalid={isInvalid}
        leftIconName={leftIcon}
        rightIconName={rightIcon}
      />
      <Status message={error} />
    </div>
  );
};

export default Input;
