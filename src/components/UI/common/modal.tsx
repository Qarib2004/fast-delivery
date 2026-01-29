"use client";
import React from "react";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  title?: string;
}

const sizeClasses: Record<string, string> = {
  xs: "max-w-xs",
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

const Modal: React.FC<IProps> = ({
  isOpen,
  onClose,
  children,
  size = "md",
  title,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className={`bg-white rounded-lg shadow-lg w-full p-6 relative ${sizeClasses[size]}`}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}

        {children}
      </div>
    </div>
  );
};

export default Modal;
