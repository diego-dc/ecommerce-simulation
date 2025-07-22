// Button.jsx (o Button.tsx)
import React from "react";
import { Icon } from "@iconify/react";

// Definimos los tipos para las props si estás usando TypeScript
type ButtonType = "primary" | "success" | "error" | "warning";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  buttonType?: ButtonType;
  iconRight?: string; // Nombre del icono de Iconify, ej: "material-symbols:arrow-right-alt-rounded"
  children?: React.ReactNode; // El texto o contenido del botón
  className?: string;
}

export default function Button({
  buttonType = "primary",
  iconRight,
  children,
  className = "",
  ...props
}: ButtonProps) {
  // Define las clases de Tailwind para cada tipo de botón
  const baseClasses =
    "px-6 py-3 rounded-lg shadow-md transition-colors duration-300 flex items-center justify-center gap-2 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const typeClasses = {
    primary:
      "bg-white text-primary-500 hover:bg-neutral-300 disabled:bg-gray-200 disabled:text-gray-500 active:bg-neutral-400",
    success:
      "bg-success-500 text-white hover:bg-success-600 disabled:bg-success-300 disabled:text-success-100 active:bg-success-700",
    error:
      "bg-error-500 text-white hover:bg-error-600 disabled:bg-error-300 disabled:text-error-100 active:bg-error-700",
    warning:
      "bg-warning-500 text-white hover:bg-warning-600 disabled:bg-warning-300 disabled:text-warning-100 active:bg-warning-700",
  };
  const combinedClasses = `${baseClasses} ${
    typeClasses[buttonType as ButtonType]
  } ${className}`;

  return (
    <button
      className={combinedClasses}
      {...props} // Pasa todas las demás props al elemento <button>
    >
      {children}
      {iconRight && <Icon icon={iconRight} className="text-xl" />}
    </button>
  );
}
