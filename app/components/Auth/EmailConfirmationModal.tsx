"use client";

import React, { useState } from "react";
import { useEmailConfirmation } from "./EmailConfirmationContext";
import { resendConfirmationEmail } from "@/lib/server_actions/auth_actions";
import { useAlert } from "../Alert/AlertContext";
import { AlertType } from "@/lib/types/alert_types";

const EmailConfirmationModal = () => {
  const { isOpen, email } = useEmailConfirmation();
  const { addAlert } = useAlert();

  const [isResending, setIsResending] = useState(false);

  const handleResend = async () => {
    if (!email) return;

    setIsResending(true);
    try {
      const result = await resendConfirmationEmail(email);
      if (result.success) {
        addAlert({
          message: "Confirmation email sent",
          type: AlertType.SUCCESS,
          duration: 5000,
        });
      } else {
        addAlert({
          message: result.error || "Failed to send confirmation email",
          type: AlertType.ERROR,
          duration: 5000,
        });
      }
    } catch (error) {
      addAlert({
        message: "An error occurred",
        type: AlertType.ERROR,
        duration: 5000,
      });
    } finally {
      setIsResending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      />

      <div className="relative z-10">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body text-center">
            {/* Email Icon */}
            <div className="flex justify-center mb-4">
              <svg
                className="w-16 h-16 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>

            {/* Title */}
            <h2 className="card-title text-2xl mb-2 justify-center">
              Check Your Email
            </h2>

            {/* Instruction text */}
            <p className="text-sm opacity-70 mb-4">
              We've sent a confirmation link to:
            </p>

            {/* User's email - prominently displayed */}
            <p className="font-semibold text-primary mb-6">{email}</p>

            {/* Info alert box */}
            <div className="alert alert-info mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-xs">
                Click the link in the email to confirm your account and
                continue.
              </span>
            </div>

            {/* Divider */}
            <div className="divider">Didn't receive it?</div>

            {/* Resend button */}
            <button
              onClick={handleResend}
              className="btn btn-outline btn-primary"
              disabled={isResending}
            >
              {isResending ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Sending...
                </>
              ) : (
                "Resend Confirmation Email"
              )}
            </button>

            {/* Helper text */}
            <p className="text-xs opacity-50 mt-4">
              Please check your spam folder if you don't see the email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmationModal;
