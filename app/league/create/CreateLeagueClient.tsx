'use client';

import React, { useState } from 'react';
import InviteCard from '../../components/InviteCard';
import NumberOfTeamsSelector from '../../components/NumberOfTeamsSelector';

const CreateLeagueClient = () => {
  const [showInviteModal, setShowInviteModal] = useState(false);

  const handleCreateLeague = () => {
    // Here you would handle the actual league creation logic
    // For now, we'll just show the invite modal
    setShowInviteModal(true);
  };

  const handleCloseInviteModal = () => {
    setShowInviteModal(false);
  };

  return (
    <>
      <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
        <div className="card w-full max-w-2xl bg-base-100 shadow-xl">
          <div className="card-body">
            <h1 className="card-title text-3xl font-bold mb-6">Create League</h1>
            
            <fieldset className="fieldset">
              <h2 className="fieldset-legend">League Name</h2>
              <input type="text" className="input input-bordered w-full" placeholder="League Name" />

              <h2 className="fieldset-legend">Number of Teams</h2>
              <NumberOfTeamsSelector defaultValue="10" />

              <h2 className="fieldset-legend">Scoring</h2>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Use Chemistry</span>
                  <div
                    className="tooltip tooltip-right"
                    data-tip="Players with Chemistry will gain bonus points if they are both active when one scores"
                  >
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                </label>
              </div>

              <h2 className="fieldset-legend">Number of Duplicate Players</h2>
              <div className="form-control">
                  <select defaultValue="10" className="select select-bordered w-full">
                  <option disabled={true}>Number of Duplicate Players</option>
                  <option>None</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  </select>
              </div>

            </fieldset>

            <div className="card-actions justify-end mt-6">
              <button 
                className="btn btn-primary btn-lg rounded"
                onClick={handleCreateLeague}
              >
                Create League
              </button>
            </div>
          </div>
        </div>
      </div>

      <InviteCard 
        isVisible={showInviteModal} 
        onClose={handleCloseInviteModal} 
      />
    </>
  );
};

export default CreateLeagueClient;
