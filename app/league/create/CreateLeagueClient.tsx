"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createLeagueAction, LeagueActionError } from "@/lib/server_actions/leagues_actions";
import { AlertType } from "@/lib/types/alert_types";
import { useAlert } from "@/app/components/Alert/AlertContext";
import { useAuthModal } from "@/app/components/Auth/AuthModalContext";

const CreateLeagueClient = () => {
  const router = useRouter();
  const { addAlert } = useAlert();
  const { openAuthModal, closeModal } = useAuthModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pendingFormDataRef = useRef<FormData | null>(null);

  const handleSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      const result = await createLeagueAction(formData);

      // Success - league created
      addAlert({
        message: "League created successfully",
        type: AlertType.SUCCESS,
        duration: 5000,
      });
      router.push(`/league/${result.league.short_code}`);

    } catch (error) {
      if (error instanceof LeagueActionError) {
        if (error.code === "AUTH_REQUIRED") {
          // User not logged in - open auth modal
          pendingFormDataRef.current = formData;

          openAuthModal("login", {
            isDismissible: false,
            onAuthSuccess: async () => {
              try {
                const retryResult = await createLeagueAction(pendingFormDataRef.current!);

                // Retry success
                addAlert({
                  message: "League created successfully",
                  type: AlertType.SUCCESS,
                  duration: 5000,
                });
                closeModal();
                router.push(`/league/${retryResult.league.short_code}`);

              } catch (retryError) {
                // Handle retry errors
                if (retryError instanceof LeagueActionError) {
                  addAlert({
                    message: retryError.message,
                    type: AlertType.ERROR,
                    duration: 5000,
                  });
                } else {
                  addAlert({
                    message: "Failed to create league after authentication",
                    type: AlertType.ERROR,
                    duration: 5000,
                  });
                }
                closeModal();
              } finally {
                pendingFormDataRef.current = null;
                setIsSubmitting(false);
              }
            }
          });

          setIsSubmitting(false);
          return;
        }
        // Handle other LeagueActionError types (LEAGUE_CREATION_FAILED, INVITE_CREATION_FAILED, etc.)
        addAlert({
          message: error.message,
          type: AlertType.ERROR,
          duration: 5000,
        });
      } else {
        // Handle unexpected errors
        addAlert({
          message: "An unexpected error occurred",
          type: AlertType.ERROR,
          duration: 5000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
        <div className="card w-full max-w-2xl bg-base-100 shadow-xl">
          <div className="card-body">
            <h1 className="card-title text-3xl font-bold mb-6">
              Create League
            </h1>

            <form action={handleSubmit} className="fieldset">
              <h2 className="fieldset-legend">League Name</h2>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="League Name"
                name="name"
                required
              />

              <h2 className="fieldset-legend">Number of Teams</h2>
              <div className="form-control">
                <select
                  className="select select-bordered w-full"
                  defaultValue="10"
                  name="numberOfTeams"
                >
                  <option disabled={true}>Number of Teams</option>
                  <option value="4">4</option>
                  <option value="6">6</option>
                  <option value="8">8</option>
                  <option value="10">10</option>
                  <option value="12">12</option>
                </select>
              </div>

              <h2 className="fieldset-legend">Scoring</h2>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Use Chemistry</span>
                  <div
                    className="tooltip tooltip-right"
                    data-tip="Players with Chemistry will gain bonus points if they are both active when one scores"
                  >
                    <input
                      type="checkbox"
                      defaultChecked
                      className="toggle"
                      name="useChemistry"
                    />
                  </div>
                </label>
              </div>

              <h2 className="fieldset-legend">Number of Duplicate Players</h2>
              <div className="form-control">
                <select
                  defaultValue="10"
                  className="select select-bordered w-full"
                  name="numOfDuplicatePlayers"
                >
                  <option disabled={true}>Number of Duplicate Players</option>
                  <option>None</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                </select>
              </div>

              <div className="card-actions justify-end mt-6">
                <button
                  className="btn btn-primary btn-lg rounded"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create League"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateLeagueClient;
