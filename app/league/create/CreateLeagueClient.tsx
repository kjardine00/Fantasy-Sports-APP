"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import NumberOfTeamsSelector from "../../components/NumberOfTeamsSelector";
import { createLeague } from "@/lib/api/leagues";

const CreateLeagueClient = () => {
  const router = useRouter();
  const supabase = createClient();


  const [leagueName, setLeagueName] = useState("");
  const [numberOfTeams, setNumberOfTeams] = useState("10");
  const [useChemistry, setUseChemistry] = useState(true);
  const [duplicatePlayers, setDuplicatePlayers] = useState("None");

  useEffect(() => {
    const tempLeagueData = sessionStorage.getItem('tempLeagueData');
    if (tempLeagueData) {
      const parsedData = JSON.parse(tempLeagueData)

      setLeagueName(parsedData.name);
      setNumberOfTeams(parsedData.numberOfTeams.toString());
      setUseChemistry(parsedData.useChemistry);
      setDuplicatePlayers(parsedData.duplicatePlayers);

      sessionStorage.removeItem('tempLeagueData');

      handleCreateLeague();
    }
  })

  const handleCreateLeague = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    const leagueData = {
      name: leagueName,
      numberOfTeams: parseInt(numberOfTeams),
      useChemistry: useChemistry,
      duplicatePlayers: duplicatePlayers
    };

    if (!user) {
      sessionStorage.setItem("tempLeagueData", JSON.stringify(leagueData));
      router.push("/login");
      return;
    } else if (user) {
      const formData = new FormData();
      formData.append('name', leagueName);
      formData.append('numberOfTeams', numberOfTeams);
      formData.append('useChemistry', useChemistry.toString());
      formData.append('duplicatePlayers', duplicatePlayers);

      const { data: league, error } = await createLeague(formData);
      if (error) {
        console.error('Failed to create League: ', error);
        //TODO: Send Error Message to the User
        return;
      }

      router.push(`/league/${league.id}`);
    }
  }

  return (
    <>
      <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
        <div className="card w-full max-w-2xl bg-base-100 shadow-xl">
          <div className="card-body">
            <h1 className="card-title text-3xl font-bold mb-6">
              Create League
            </h1>

            <form action={handleCreateLeague} className="fieldset">
              <h2 className="fieldset-legend">League Name</h2>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="League Name"
                value={leagueName}
                onChange={(e) => setLeagueName(e.target.value)}
                required
              />

              <h2 className="fieldset-legend">Number of Teams</h2>
              <NumberOfTeamsSelector defaultValue="10" onChange={setNumberOfTeams} value={numberOfTeams} />

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
                      defaultChecked className="toggle"
                      checked={useChemistry}
                      onChange={(e) => setUseChemistry(e.target.checked)}
                    />
                  </div>
                </label>
              </div>

              <h2 className="fieldset-legend">Number of Duplicate Players</h2>
              <div className="form-control">
                <select
                  defaultValue="10"
                  className="select select-bordered w-full"
                  value={duplicatePlayers}
                  onChange={(e) => setDuplicatePlayers(e.target.value)}
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
                >
                  Create League
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
