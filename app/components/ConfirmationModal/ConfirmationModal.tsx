"use client";

import React, { useEffect, useState } from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "primary" | "warning" | "error";
  isLoading?: boolean;
  isDismissible?: boolean;
  showIcon?: boolean;
  children?: React.ReactNode; // Optional custom content
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary",
  isLoading = false,
  isDismissible = true,
  showIcon = false,
  children,
}: ConfirmationModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDismissible && !isLoading && !isProcessing) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }
  }, [isOpen, onClose, isDismissible, isLoading, isProcessing]);

  const handleConfirm = async () => {
    if (isLoading || isProcessing) return;
    
    setIsProcessing(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error("Error in confirmation action:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Get variant-specific button classes
  const getVariantClasses = () => {
    switch (variant) {
      case "warning":
        return "btn-warning";
      case "error":
        return "btn-error";
      default:
        return "btn-primary";
    }
  };

  // Get icon based on variant
  const renderIcon = () => {
    if (!showIcon) return null;

    const iconProps = {
      className: "w-12 h-12",
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24",
    };

    switch (variant) {
      case "warning":
        return (
          <svg {...iconProps} className="w-12 h-12 text-warning">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        );
      case "error":
        return (
          <svg {...iconProps} className="w-12 h-12 text-error">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return (
          <svg {...iconProps} className="w-12 h-12 text-primary">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  if (!isOpen) return null;

  const isDisabled = isLoading || isProcessing;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        onClick={isDismissible && !isDisabled ? onClose : undefined}
      />
      <div className="relative z-10">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body text-center">
            {/* Icon */}
            {showIcon && (
              <div className="flex justify-center mb-4">{renderIcon()}</div>
            )}

            {/* Title */}
            <h2 className="card-title text-2xl mb-2 justify-center">{title}</h2>

            {/* Description */}
            <p className="text-sm opacity-70 mb-4">{description}</p>

            {/* Custom content slot */}
            {children && <div className="mb-4">{children}</div>}

            {/* Action Buttons */}
            <div className="flex justify-center gap-3 mt-4">
              <button
                className="btn btn-outline rounded-full"
                onClick={onClose}
                disabled={isDisabled}
              >
                {cancelText}
              </button>
              <button
                className={`btn ${getVariantClasses()} rounded-full`}
                onClick={handleConfirm}
                disabled={isDisabled}
              >
                {isDisabled ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Processing...
                  </>
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
