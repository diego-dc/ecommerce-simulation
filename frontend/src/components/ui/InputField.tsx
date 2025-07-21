// InputField.tsx
import React from "react";
import { Icon } from "@iconify/react";

interface InputFieldProps {
  type: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  isInvalid: boolean;
  leftIconName?: string;
  rightIconName?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  type,
  id,
  name,
  value,
  onChange,
  placeholder,
  isInvalid,
  leftIconName,
  rightIconName,
}) => {
  const borderColorClass = isInvalid ? "border-red-500" : "border-gray-300";
  const focusRingClass = isInvalid
    ? "focus:ring-red-500"
    : "focus:ring-blue-500";

  return (
    <div
      className={`relative flex items-center border rounded-sm ${borderColorClass} shadow-sm gap-xs w-full py-md px-xl bg-card`}
    >
      {leftIconName && (
        <div className="flex items-center justify-center pointer-events-none">
          <Icon icon={leftIconName} className="text-xl icon-primary " />
        </div>
      )}
      <div className={`flex-1 flex `}>
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full text-disabled focus:outline-none border-none ${focusRingClass} focus:border-transparent`}
        />
      </div>
      {rightIconName && (
        <div className="flex items-center justify-center pointer-events-none">
          <Icon icon={rightIconName} className="text-xl icon-primary" />
        </div>
      )}
    </div>
  );
};

export default InputField;
