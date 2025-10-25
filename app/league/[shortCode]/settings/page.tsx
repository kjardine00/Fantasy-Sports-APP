"use client";

import React, { useState, useEffect } from "react";
import NumberOfTeamsSelector from "../../../components/NumberOfTeamsSelector";
import { useLeague } from "../../LeagueContext";

// TODO: IMPLEMENTATION REQUIRED
// 1. Create getLeagueSettingsAction in lib/server_actions/leagues_actions.ts:
//    - Add function to fetch league settings from database
//    - Handle authentication and error cases
// 2. Create updateLeagueSettingsAction in lib/server_actions/leagues_actions.ts:
//    - Add function to update league settings in database
//    - Include permission checking (only commissioners/owners can edit)
//    - Handle authentication and error cases
// 3. Import both actions: 
//    import { getLeagueSettingsAction, updateLeagueSettingsAction } from "@/lib/server_actions/leagues_actions";
// 4. Replace the useEffect implementation below with server action calls
// 5. Uncomment the handleSave function implementation below

// Define the structure for league settings
interface LeagueSettings {
  // Basic Settings
  leagueName: string;
  numberOfTeams: number;
  isPublic: boolean;
  
  // Draft Settings
  draftType: 'snake' | 'auction' | 'offline';
  draftDate: string;
  draftTime: string;
  timePerPick: number;
  
  // Roster Settings
  rosterSize: number;
  totalStartingPlayers: number;
  allowDuplicatePicks: boolean;
  numberOfDuplicates: number;
  
  // Scoring Settings
  useChemistry: boolean;
  chemistryBonusPoints: number;
}

const SettingsPage = () => {
  const { league } = useLeague();
  
  // State management
  const [isEditing, setIsEditing] = useState(false);
  const [settings, setSettings] = useState<LeagueSettings>({
    leagueName: league.name || '',
    numberOfTeams: 10,
    isPublic: true,
    draftType: 'snake',
    draftDate: '',
    draftTime: '',
    timePerPick: 90,
    rosterSize: 10,
    totalStartingPlayers: 10,
    allowDuplicatePicks: true,
    numberOfDuplicates: 2,
    useChemistry: true,
    chemistryBonusPoints: 1,
  });
  const [originalSettings, setOriginalSettings] = useState<LeagueSettings>(settings);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch settings from database on mount
  useEffect(() => {
    const fetchSettings = async () => {
      if (!league.id) return;
      
      // TODO: IMPLEMENTATION REQUIRED
      // Replace this with server action call:
      /*
      try {
        setIsLoading(true);
        const { data, error } = await getLeagueSettingsAction(league.id);
        
        if (error) {
          console.error('Error fetching league settings:', error);
          return;
        }
        
        if (data?.settings) {
          // Merge database settings with defaults
          const dbSettings = data.settings as Partial<LeagueSettings>;
          const mergedSettings = { ...settings, ...dbSettings };
          setSettings(mergedSettings);
          setOriginalSettings(mergedSettings);
        }
      } catch (error) {
        console.error('Error fetching league settings:', error);
      } finally {
        setIsLoading(false);
      }
      */
      
      // Temporary implementation - just set loading to false
      setIsLoading(false);
    };

    fetchSettings();
  }, [league.id]);

  // Handle edit mode toggle
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setSettings(originalSettings);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!league.id) return;
    
    // TODO: IMPLEMENTATION REQUIRED
    // Uncomment this code once updateLeagueSettingsAction is implemented:
    /*
    try {
      const { error } = await updateLeagueSettingsAction(league.id, settings);
      
      if (error) {
        console.error('Error saving settings:', error);
        // TODO: Show error message to user
        return;
      }
      
      setOriginalSettings(settings);
      setIsEditing(false);
      // TODO: Show success message to user
    } catch (error) {
      console.error('Error saving settings:', error);
      // TODO: Show error message to user
    }
    */
    
    // Temporary implementation for testing UI
    console.log('Saving settings:', settings);
    setOriginalSettings(settings);
    setIsEditing(false);
  };

  // Handle input changes
  const handleInputChange = (field: keyof LeagueSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="league-page min-h-screen bg-base-200">
        <div className="container mx-auto px-4 py-8">
          <div className="card w-full bg-base-100 shadow-lg">
            <div className="flex items-center justify-center p-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="league-page min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="card w-full bg-base-100 shadow-lg">
          <div className="flex items-center justify-between mx-6 px-4 py-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">League Settings</h1>
              <h4 className="text-md font-semibold text-base-content/70">
                {league.name}
              </h4>
            </div>
            
            <div className="flex gap-2">
              {!isEditing ? (
                <button 
                  onClick={handleEdit}
                  className="btn btn-primary rounded-full"
                >
                  Edit Settings
                </button>
              ) : (
                <>
                  <button 
                    onClick={handleCancel}
                    className="btn btn-outline rounded-full"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    className="btn btn-primary rounded-full"
                  >
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="settings-section mx-6 px-4 py-6">
            <h2>Basic Settings</h2>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              <tr>
                <th>League Name</th>
                <td>
                  {isEditing ? (
                    <label className="floating-label">
                      <input
                        type="text"
                        value={settings.leagueName}
                        onChange={(e) => handleInputChange('leagueName', e.target.value)}
                        className="input input-md"
                      />
                    </label>
                  ) : (
                    <span className="text-base-content">{settings.leagueName}</span>
                  )}
                </td>
              </tr>
              {/* row 2 */}
              <tr>
                <th>Number of Teams</th>
                <td>
                  {isEditing ? (
                    <NumberOfTeamsSelector 
                      value={settings.numberOfTeams.toString()} 
                      onChange={(value) => handleInputChange('numberOfTeams', parseInt(value))}
                    />
                  ) : (
                    <span className="text-base-content">{settings.numberOfTeams}</span>
                  )}
                </td>
              </tr>
              {/* row 3 */}
              <tr>
                <th>Make League Viewable to Public</th>
                <td>
                  {isEditing ? (
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <div className="tooltip tooltip-right">
                          <input
                            type="checkbox"
                            checked={settings.isPublic}
                            onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                            className="toggle"
                          />
                        </div>
                      </label>
                    </div>
                  ) : (
                    <span className="text-base-content">{settings.isPublic ? 'Yes' : 'No'}</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
          </div>

          <div className="settings-section mx-6 px-4 py-6">
            <h2>Draft Settings</h2>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              <tr>
                <th>Draft Type</th>
                <td>
                  {isEditing ? (
                    <select 
                      value={settings.draftType} 
                      onChange={(e) => handleInputChange('draftType', e.target.value as 'snake' | 'auction' | 'offline')}
                      className="select"
                    >
                      <option disabled={true}>Draft Type</option>
                      <option value="offline">Offline</option>
                      <option value="snake">Snake</option>
                      <option value="auction">Auction</option>
                    </select>
                  ) : (
                    <span className="text-base-content capitalize">{settings.draftType}</span>
                  )}
                </td>
              </tr>
              {/* row 2 */}
              <tr>
                <th>Draft Date</th>
                <td>
                  {isEditing ? (
                    <input
                      type="date"
                      value={settings.draftDate}
                      onChange={(e) => handleInputChange('draftDate', e.target.value)}
                      className="input input-md"
                    />
                  ) : (
                    <span className="text-base-content">{settings.draftDate || 'Not set'}</span>
                  )}
                </td>
              </tr>
              {/* row 3 */}
              <tr>
                <th>Draft Time</th>
                <td>
                  {isEditing ? (
                    <input
                      type="time"
                      value={settings.draftTime}
                      onChange={(e) => handleInputChange('draftTime', e.target.value)}
                      className="input input-md"
                    />
                  ) : (
                    <span className="text-base-content">{settings.draftTime || 'Not set'}</span>
                  )}
                </td>
              </tr>
              {/* row 5 */}
              <tr>
                <th>Time per Pick</th>
                <td>
                  <div className="form-control">
                    <select
                      defaultValue="90"
                      className="select select-bordered w-full"
                    >
                      <option value="30">30 seconds</option>
                      <option value="60">60 seconds</option>
                      <option value="90">90 seconds</option>
                      <option value="120">2 minutes</option>
                      <option value="300">5 minutes</option>
                      <option value="600">10 minutes</option>
                      <option value="1200">30 minutes</option>
                    </select>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
          </div>

          <div className="settings-section mx-6 px-4 py-6">
            <h2>Roster Settings</h2>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              <tr>
                <th>Roster Size</th>
                <td>
                  <div className="form-control">
                    <select
                      defaultValue="10"
                      className="select select-bordered w-full"
                    >
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                      <option value="11">11</option>
                      <option value="12">12</option>
                      <option value="13">13</option>
                      <option value="14">14</option>
                      <option value="15">15</option>
                    </select>
                  </div>
                </td>
              </tr>
              {/* row 2 */}
              <tr>
                <th>Total Starting Players</th>
                <td>
                  <div className="form-control">
                    <select
                      defaultValue="10"
                      className="select select-bordered w-full"
                    >
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                      <option value="11">11</option>
                      <option value="12">12</option>
                      <option value="13">13</option>
                      <option value="14">14</option>
                      <option value="15">15</option>
                    </select>
                  </div>
                </td>
              </tr>
              {/* row 3 */}
              <tr>
                <th>Allow Duplicate Draft Picks</th>
                <td>
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <div
                        className="tooltip tooltip-right"
                        // data-tip=""
                      >
                        <input
                          type="checkbox"
                          defaultChecked
                          className="toggle"
                        />
                      </div>
                    </label>
                  </div>
                </td>
              </tr>
              {/* row 4 */}
              <tr>
                <th>Number of Draftable Duplicates</th>
                <td>
                  <div className="form-control">
                    <select
                      defaultValue="10"
                      className="select select-bordered w-full"
                    >
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>
                  </div>
                </td>
              </tr>
              {/* row 5 */}
              <tr>
                <th>Time per Pick</th>
                <td>
                  <div className="form-control">
                    <select
                      defaultValue="90"
                      className="select select-bordered w-full"
                    >
                      <option value="30">30 seconds</option>
                      <option value="60">60 seconds</option>
                      <option value="90">90 seconds</option>
                      <option value="120">2 minutes</option>
                      <option value="300">5 minutes</option>
                      <option value="600">10 minutes</option>
                      <option value="1200">30 minutes</option>
                    </select>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
          </div>

          <div className="settings-section mx-6 px-4 py-6">
            <h2>Scoring Settings</h2>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              <tr>
                <th>Use Chemistry</th>
                <td>
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <div
                        className="tooltip tooltip-right"
                        // data-tip=""
                      >
                        <input
                          type="checkbox"
                          defaultChecked
                          className="toggle"
                        />
                      </div>
                    </label>
                  </div>
                </td>
              </tr>
              {/* row 2 */}
              <tr>
                <th>Chemistry Bonus Points</th>
                <td>
                  <div className="form-control">
                    <select
                      defaultValue="1"
                      className="select select-bordered w-full"
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

{
  /* <button className="btn btn-outline btn-primary rounded-full">Edit</button> */
}
