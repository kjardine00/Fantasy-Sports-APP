"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import NumberOfTeamsSelector from "../../components/NumberOfTeamsSelector";
import { createLeagueAction } from "@/lib/server_actions/leagues_actions";
import { AlertType } from "@/lib/types/alert_types";
import { useAlert } from "@/app/components/Alert/AlertContext";
import { useAuthModal } from "@/app/components/Auth/AuthModalContext";

const CreateLeagueClient = () => {
  const router = useRouter();
  const { addAlert } = useAlert();
  const { openAuthModal, closeModal } = useAuthModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pendingFormDataRef = useRef<FormData | null>(null);

  // Auth State Change Listener
  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);

    try {
      const result = await createLeagueAction(formData);

      if (result?.error) {
        if (result.error === "You must be logged in to create a league") {
          pendingFormDataRef.current = formData;

          openAuthModal("login", {
            isDismissible: false,
            onAuthSuccess: async () => {
              try {
                const retryResult = await createLeagueAction(pendingFormDataRef.current!);
                
                if (retryResult?.error) {
                  addAlert({
                    message: retryResult.error,
                    type: AlertType.ERROR,
                    duration: 5000,
                  });
                  closeModal();
                } else if (retryResult?.data) {
                  addAlert({
                    message: "League created successfully",
                    type: AlertType.SUCCESS,
                    duration: 5000,
                  });
                  closeModal();
                  router.push(`/league/${retryResult.data.short_code}`);
                }
              } catch (error) {
                addAlert({
                  message: "Failed to create league after authentication",
                  type: AlertType.ERROR,
                  duration: 5000,
                });
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
        
        // Other errors
        addAlert({
          message: result.error,
          type: AlertType.ERROR,
          duration: 5000,
        });
      } else if (result?.data) {
        addAlert({
          message: "League created successfully",
          type: AlertType.SUCCESS,
          duration: 5000,
        });
        router.push(`/league/${result.data.short_code}`);
      }
    } catch (error) {
      addAlert({
        message: "An unexpected error occurred",
        type: AlertType.ERROR,
        duration: 5000,
      });
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
              <NumberOfTeamsSelector defaultValue="10" name="numberOfTeams" />

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
                  name="duplicatePlayers"
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
