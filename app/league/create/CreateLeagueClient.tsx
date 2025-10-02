"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NumberOfTeamsSelector from "../../components/NumberOfTeamsSelector";
import { LeagueService } from "@/lib/services/league/leagues_service";
import { AlertType } from "@/lib/types/alert_types";
import { useAlert } from "@/app/components/Alert/AlertContext";

const CreateLeagueClient = () => {
  const router = useRouter();
  const { addAlert } = useAlert();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check for temp data from previous unauthenticated attempt
    const tempLeagueData = sessionStorage.getItem("tempLeagueData");
    if (tempLeagueData) {
      const parsedData = JSON.parse(tempLeagueData);

      // Pre-populate form fields directly
      const nameInput = document.querySelector(
        'input[name="name"]'
      ) as HTMLInputElement;
      const numberOfTeamsSelect = document.querySelector(
        'select[name="numberOfTeams"]'
      ) as HTMLSelectElement;
      const chemistryInput = document.querySelector(
        'input[name="useChemistry"]'
      ) as HTMLInputElement;
      const duplicatePlayersSelect = document.querySelector(
        'select[name="duplicatePlayers"]'
      ) as HTMLSelectElement;

      if (nameInput) nameInput.value = parsedData.name;
      if (numberOfTeamsSelect)
        numberOfTeamsSelect.value = parsedData.numberOfTeams.toString();
      if (chemistryInput) chemistryInput.checked = parsedData.useChemistry;
      if (duplicatePlayersSelect)
        duplicatePlayersSelect.value = parsedData.duplicatePlayers;

      sessionStorage.removeItem("tempLeagueData");

      // Auto-submit the form
      const form = document.querySelector("form[action]") as HTMLFormElement;
      if (form) form.requestSubmit();
    }
  }, []);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);

    sessionStorage.removeItem("tempLeagueData");

    try {
      const result = await LeagueService.createLeague(formData);

      if (result?.error) {
        if (result.error === "You must be logged in to create a league") {
          const tempData = {
            name: formData.get("name") as string,
            numberOfTeams: formData.get("numberOfTeams") as string,
            useChemistry: formData.get("useChemistry") === "on",
            duplicatePlayers: formData.get("duplicatePlayers") as string,
          };
          sessionStorage.setItem("tempLeagueData", JSON.stringify(tempData));
          router.push("/login");
        } else {
          addAlert({
            message: result.error,
            type: AlertType.ERROR,
            duration: 5000,
          });
        }
      } else if (result?.data) {
        addAlert({
          message: "League created successfully",
          type: AlertType.SUCCESS,
          duration: 5000,
        });
        router.push(`/league/${result.data.id}`);
      }
    } catch (err) {
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
