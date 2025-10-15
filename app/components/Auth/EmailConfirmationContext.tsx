"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface EmailConfirmationContextType {
  isOpen: boolean;
  email: string | null;
  openModal: (email: string, destination?: string) => void;
  closeModal: () => void;
}

const EmailConfirmationContext = createContext<
  EmailConfirmationContextType | undefined
>(undefined);

export const EmailConfirmationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  const openModal = useCallback((userEmail: string, destination?: string) => {
    setEmail(userEmail);
    setIsOpen(true);

    if (typeof window !== "undefined") {
      sessionStorage.setItem("userPendingEmail", userEmail);

      if (destination) {
        sessionStorage.setItem("redirectAfterConfirm", destination);
      }
    }
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEmail(null);

    if (typeof window !== "undefined") {
      sessionStorage.removeItem("userPendingEmail");
    }
  }, []);

  return (
    <EmailConfirmationContext.Provider
      value={{ isOpen, email, openModal, closeModal }}
    >
      {children}
    </EmailConfirmationContext.Provider>
  );
};

export const useEmailConfirmation = () => {
  const context = useContext(EmailConfirmationContext);

  if (!context) {
    throw new Error(
      "useEmailConfirmation must be used within an EmailConfirmationProvider"
    );
  }
  return context;
};
