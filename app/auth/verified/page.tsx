"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEmailConfirmation } from "@/app/components/Auth/EmailConfirmationContext";

export default function VerifiedPage() {
  const router = useRouter();
  const { closeModal } = useEmailConfirmation();

  useEffect(() => {
    closeModal();

    let destination = "/";

    const storedDestination = sessionStorage.getItem("redirectAfterConfirm");
    if (storedDestination) {
      destination = storedDestination;

      sessionStorage.removeItem("redirectAfterConfirm");
      sessionStorage.removeItem("userPendingEmail");
      sessionStorage.removeItem("pendingInviteToken");
    }

    router.push(destination);
  }, [router, closeModal]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body text-center">
          {/* Success checkmark icon */}
          <div className="flex justify-center mb-4">
            <svg
              className="w-16 h-16 text-success"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h2 className="card-title text-2xl mb-2 justify-center">
            Email Verified!
          </h2>

          <p className="text-sm opacity-70">Redirecting you now...</p>

          <span className="loading loading-spinner loading-lg mt-4"></span>
        </div>
      </div>
    </div>
  );
}
