"use client";

import React, { useState, useEffect } from "react";
import { useLeague } from "../../LeagueContext";
import { useAlert } from "@/app/components/Alert/AlertContext";
import { AlertType } from "@/lib/types/alert_types";
import {
  getLeagueSettingsAction,
  updateLeagueSettingsAction,
} from "@/lib/server_actions/leagues_actions";
import { LeagueSettings } from "@/lib/types/database_types";
import { SettingsFormState } from "@/lib/types/settings_types";
import Link from "next/link";

const SettingsPage = () => {
  const { league } = useLeague();
  const { addAlert } = useAlert();

  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [originalSettings, setOriginalSettings] = useState<SettingsFormState>();
  const [settings, setSettings] = useState<SettingsFormState>({
    leagueName: league.name,
    numberOfTeams: 10,
    isPublic: false,
    draftType: "snake",
    draftDate: "",
    draftTime: "",
    timePerPick: 90,
    rosterSize: 10,
    totalStartingPlayers: 6,
    allowDuplicatePicks: false,
    numberOfDuplicates: 0,
    useChemistry: true,
    chemistryMultiplier: 1.5,
    useBigPlays: false,
    bigPlaysMultiplier: 2,
  });

  // Fetch settings from database on mount
  useEffect(() => {
    const fetchSettings = async () => {
      if (!league.id) return;

      try {
        setIsLoading(true);
        const { data: dataSettings, error } = await getLeagueSettingsAction(
          league.id
        );

        if (error) {
          addAlert({
            message: error,
            type: AlertType.ERROR,
            duration: 3000,
          });
          return;
        }

        if (dataSettings) {
          setSettings(dataSettings);
          setOriginalSettings(dataSettings);
        }
      } catch (error) {
        addAlert({
          message: "Settings could not be loaded",
          type: AlertType.ERROR,
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, [league.id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!league.id) return;

    try {
      const { error } = await updateLeagueSettingsAction(league.id, settings);

      if (error) {
        console.error("Error saving settings:", error);
        addAlert({
          message: "Error saving settings",
          type: AlertType.ERROR,
          duration: 3000,
        });
        return;
      }

      setOriginalSettings(settings);
      setIsEditing(false);
      addAlert({
        message: "Settings saved successfully",
        type: AlertType.SUCCESS,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      addAlert({
        message: "Error saving settings",
        type: AlertType.ERROR,
        duration: 3000,
      });
    }
  };

  const handleCancel = () => {
    if (originalSettings) {
      setSettings(originalSettings);
    }
    setIsEditing(false);
  };

  // Handle input changes
  const handleInputChange = (field: keyof SettingsFormState, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
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
    <div className="league-page min-h-screen bg-gradient-to-br from-base-200 to-base-300">
      <div className="container mx-auto px-4 py-8">
        <div className="card w-full bg-base-100 shadow-2xl border border-base-300">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-base-300">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mx-6 px-4 py-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  League Settings
                </h1>
                <Link 
                  href={`/league/${league.short_code}`}
                  className="text-sm font-semibold text-base-content/60 hover:text-primary transition-all duration-200 flex items-center gap-2 w-fit"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to {league.name} page
                </Link>
              </div>

              <div className="flex gap-2">
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="btn btn-primary rounded-full shadow-lg hover:shadow-xl transition-all duration-200 gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Settings
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleCancel}
                      className="btn btn-ghost rounded-full hover:bg-base-200 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="btn btn-primary rounded-full shadow-lg hover:shadow-xl transition-all duration-200 gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Changes
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Basic Settings Section */}
          <div className="settings-section mx-6 px-4 py-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
              <h2 className="text-2xl font-bold text-base-content">Basic Settings</h2>
            </div>
            <div className="overflow-x-auto bg-base-200/50 rounded-xl p-4 shadow-inner">
              <table className="table table-zebra">
                <tbody>
                  {/* row 1 */}
                  <tr className="">
                    <th className="text-base-content/80 font-normal border-r border-base-300 w-1/2">League Name</th>
                    <td>
                      {isEditing ? (
                        <label className="floating-label">
                          <input
                            type="text"
                            value={settings.leagueName}
                            onChange={(e) =>
                              handleInputChange("leagueName", e.target.value)
                            }
                            className="input input-bordered input-md w-full max-w-xs focus:input-primary transition-all"
                          />
                        </label>
                      ) : (
                        <span className="text-base-content font-medium">
                          {settings.leagueName}
                        </span>
                      )}
                    </td>
                  </tr>
                  {/* row 2 */}
                  <tr className="">
                    <th className="text-base-content/80 font-normal border-r border-base-300 w-1/2">Number of Teams</th>
                    <td>
                      {isEditing ? (
                        <div className="form-control">
                          <select
                            value={settings.numberOfTeams.toString()}
                            onChange={(e) =>
                              handleInputChange("numberOfTeams", parseInt(e.target.value))
                            }
                            className="select select-bordered w-full max-w-xs focus:select-primary transition-all"
                          >
                            <option value="4">4</option>
                            <option value="6">6</option>
                            <option value="8">8</option>
                            <option value="10">10</option>
                            <option value="12">12</option>
                          </select>
                        </div>
                      ) : (
                        <span className="text-base-content font-medium">
                          {settings.numberOfTeams}
                        </span>
                      )}
                    </td>
                  </tr>
                  {/* row 3 */}
                  <tr className="">
                    <th className="text-base-content/80 font-normal border-r border-base-300 w-1/2">Make League Viewable to Public</th>
                    <td>
                      {isEditing ? (
                        <div className="form-control">
                          <label className="label cursor-not-allowed justify-start gap-3">
                            <input
                              type="checkbox"
                              checked={settings.isPublic}
                              onChange={(e) =>
                                handleInputChange(
                                  "isPublic",
                                  e.target.checked
                                )
                              }
                              className="toggle toggle-primary opacity-50"
                              disabled
                            />
                            <span className="text-sm text-base-content/40 italic">
                              Coming Soon
                            </span>
                          </label>
                        </div>
                      ) : (
                        <span className="badge badge-lg badge-outline">
                          {settings.isPublic ? "Public" : "Private"}
                        </span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Draft Settings Section */}
          <div className="settings-section mx-6 px-4 py-8 border-t border-base-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
              <h2 className="text-2xl font-bold text-base-content">Draft Settings</h2>
            </div>
            <div className="overflow-x-auto bg-base-200/50 rounded-xl p-4 shadow-inner">
              <table className="table table-zebra">
                <tbody>
                  {/* row 1 */}
                  <tr className="">
                    <th className="text-base-content/80 font-normal border-r border-base-300 w-1/2">Draft Type</th>
                    <td>
                      {isEditing ? (
                        <select
                          value={settings.draftType}
                          onChange={(e) =>
                            handleInputChange(
                              "draftType",
                              e.target.value as "snake" | "auction" | "offline"
                            )
                          }
                          className="select select-bordered w-full max-w-xs focus:select-primary transition-all"
                        >
                          <option disabled={true}>Draft Type</option>
                          <option value="offline">Offline</option>
                          <option value="snake">Snake</option>
                          <option value="auction" disabled>Auction (Coming Soon)</option>
                        </select>
                      ) : (
                        <span className="badge badge-lg badge-outline capitalize">
                          {settings.draftType}
                        </span>
                      )}
                    </td>
                  </tr>
                  {/* row 2 */}
                  <tr className="">
                    <th className="text-base-content/80 font-normal border-r border-base-300 w-1/2">Draft Date</th>
                    <td>
                      {isEditing ? (
                        <input
                          type="date"
                          value={settings.draftDate}
                          onChange={(e) =>
                            handleInputChange("draftDate", e.target.value)
                          }
                          className="input input-bordered input-md w-full max-w-xs focus:input-primary transition-all"
                        />
                      ) : (
                        <span className="text-base-content font-medium">
                          {settings.draftDate || <span className="text-base-content/50 italic">Not set</span>}
                        </span>
                      )}
                    </td>
                  </tr>
                  {/* row 3 */}
                  <tr className="">
                    <th className="text-base-content/80 font-normal border-r border-base-300 w-1/2">Draft Time</th>
                    <td>
                      {isEditing ? (
                        <div className="form-control">
                          <select
                            value={settings.draftTime}
                            onChange={(e) =>
                              handleInputChange("draftTime", e.target.value)
                            }
                            className="select select-bordered w-full max-w-xs focus:select-primary transition-all"
                          >
                            <option value="">Select Time</option>
                            <option value="00:00">12:00 AM</option>
                            <option value="00:15">12:15 AM</option>
                            <option value="00:30">12:30 AM</option>
                            <option value="00:45">12:45 AM</option>
                            <option value="01:00">1:00 AM</option>
                            <option value="01:15">1:15 AM</option>
                            <option value="01:30">1:30 AM</option>
                            <option value="01:45">1:45 AM</option>
                            <option value="02:00">2:00 AM</option>
                            <option value="02:15">2:15 AM</option>
                            <option value="02:30">2:30 AM</option>
                            <option value="02:45">2:45 AM</option>
                            <option value="03:00">3:00 AM</option>
                            <option value="03:15">3:15 AM</option>
                            <option value="03:30">3:30 AM</option>
                            <option value="03:45">3:45 AM</option>
                            <option value="04:00">4:00 AM</option>
                            <option value="04:15">4:15 AM</option>
                            <option value="04:30">4:30 AM</option>
                            <option value="04:45">4:45 AM</option>
                            <option value="05:00">5:00 AM</option>
                            <option value="05:15">5:15 AM</option>
                            <option value="05:30">5:30 AM</option>
                            <option value="05:45">5:45 AM</option>
                            <option value="06:00">6:00 AM</option>
                            <option value="06:15">6:15 AM</option>
                            <option value="06:30">6:30 AM</option>
                            <option value="06:45">6:45 AM</option>
                            <option value="07:00">7:00 AM</option>
                            <option value="07:15">7:15 AM</option>
                            <option value="07:30">7:30 AM</option>
                            <option value="07:45">7:45 AM</option>
                            <option value="08:00">8:00 AM</option>
                            <option value="08:15">8:15 AM</option>
                            <option value="08:30">8:30 AM</option>
                            <option value="08:45">8:45 AM</option>
                            <option value="09:00">9:00 AM</option>
                            <option value="09:15">9:15 AM</option>
                            <option value="09:30">9:30 AM</option>
                            <option value="09:45">9:45 AM</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="10:15">10:15 AM</option>
                            <option value="10:30">10:30 AM</option>
                            <option value="10:45">10:45 AM</option>
                            <option value="11:00">11:00 AM</option>
                            <option value="11:15">11:15 AM</option>
                            <option value="11:30">11:30 AM</option>
                            <option value="11:45">11:45 AM</option>
                            <option value="12:00">12:00 PM</option>
                            <option value="12:15">12:15 PM</option>
                            <option value="12:30">12:30 PM</option>
                            <option value="12:45">12:45 PM</option>
                            <option value="13:00">1:00 PM</option>
                            <option value="13:15">1:15 PM</option>
                            <option value="13:30">1:30 PM</option>
                            <option value="13:45">1:45 PM</option>
                            <option value="14:00">2:00 PM</option>
                            <option value="14:15">2:15 PM</option>
                            <option value="14:30">2:30 PM</option>
                            <option value="14:45">2:45 PM</option>
                            <option value="15:00">3:00 PM</option>
                            <option value="15:15">3:15 PM</option>
                            <option value="15:30">3:30 PM</option>
                            <option value="15:45">3:45 PM</option>
                            <option value="16:00">4:00 PM</option>
                            <option value="16:15">4:15 PM</option>
                            <option value="16:30">4:30 PM</option>
                            <option value="16:45">4:45 PM</option>
                            <option value="17:00">5:00 PM</option>
                            <option value="17:15">5:15 PM</option>
                            <option value="17:30">5:30 PM</option>
                            <option value="17:45">5:45 PM</option>
                            <option value="18:00">6:00 PM</option>
                            <option value="18:15">6:15 PM</option>
                            <option value="18:30">6:30 PM</option>
                            <option value="18:45">6:45 PM</option>
                            <option value="19:00">7:00 PM</option>
                            <option value="19:15">7:15 PM</option>
                            <option value="19:30">7:30 PM</option>
                            <option value="19:45">7:45 PM</option>
                            <option value="20:00">8:00 PM</option>
                            <option value="20:15">8:15 PM</option>
                            <option value="20:30">8:30 PM</option>
                            <option value="20:45">8:45 PM</option>
                            <option value="21:00">9:00 PM</option>
                            <option value="21:15">9:15 PM</option>
                            <option value="21:30">9:30 PM</option>
                            <option value="21:45">9:45 PM</option>
                            <option value="22:00">10:00 PM</option>
                            <option value="22:15">10:15 PM</option>
                            <option value="22:30">10:30 PM</option>
                            <option value="22:45">10:45 PM</option>
                            <option value="23:00">11:00 PM</option>
                            <option value="23:15">11:15 PM</option>
                            <option value="23:30">11:30 PM</option>
                            <option value="23:45">11:45 PM</option>
                          </select>
                        </div>
                      ) : (
                        <span className="text-base-content font-medium">
                          {settings.draftTime ? (() => {
                            const [hours, minutes] = settings.draftTime.split(':');
                            const hour = parseInt(hours);
                            const period = hour >= 12 ? 'PM' : 'AM';
                            const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                            return `${displayHour}:${minutes} ${period}`;
                          })() : <span className="text-base-content/50 italic">Not set</span>}
                        </span>
                      )}
                    </td>
                  </tr>
                  {/* row 5 */}
                  <tr className="">
                    <th className="text-base-content/80 font-normal border-r border-base-300 w-1/2">Time per Pick</th>
                    <td>
                      {isEditing ? (
                        <div className="form-control">
                          <select
                            value={settings.timePerPick.toString()}
                            onChange={(e) =>
                              handleInputChange("timePerPick", parseInt(e.target.value))
                            }
                            className="select select-bordered w-full max-w-xs focus:select-primary transition-all"
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
                      ) : (
                        <span className="text-base-content font-medium">
                          {settings.timePerPick < 60
                            ? `${settings.timePerPick} seconds`
                            : settings.timePerPick < 3600
                            ? `${settings.timePerPick / 60} minute${settings.timePerPick / 60 > 1 ? 's' : ''}`
                            : `${settings.timePerPick / 3600} hour${settings.timePerPick / 3600 > 1 ? 's' : ''}`}
                        </span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Roster Settings Section */}
          <div className="settings-section mx-6 px-4 py-8 border-t border-base-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
              <h2 className="text-2xl font-bold text-base-content">Roster Settings</h2>
            </div>
            <div className="overflow-x-auto bg-base-200/50 rounded-xl p-4 shadow-inner">
              <table className="table table-zebra">
                <tbody>
                  {/* row 1 */}
                  <tr className="">
                    <th className="text-base-content/80 font-normal border-r border-base-300 w-1/2">Roster Size</th>
                    <td>
                      {isEditing ? (
                        <div className="form-control">
                          <select
                            value={settings.rosterSize.toString()}
                            onChange={(e) =>
                              handleInputChange("rosterSize", parseInt(e.target.value))
                            }
                            className="select select-bordered w-full max-w-xs focus:select-primary transition-all"
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
                      ) : (
                        <span className="text-base-content font-medium">
                          {settings.rosterSize}
                        </span>
                      )}
                    </td>
                  </tr>
                  {/* row 2 */}
                  <tr className="">
                    <th className="text-base-content/80 font-normal border-r border-base-300 w-1/2">Total Starting Players</th>
                    <td>
                      {isEditing ? (
                        <div className="form-control">
                          <select
                            value={settings.totalStartingPlayers.toString()}
                            onChange={(e) =>
                              handleInputChange("totalStartingPlayers", parseInt(e.target.value))
                            }
                            className="select select-bordered w-full max-w-xs focus:select-primary transition-all"
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
                      ) : (
                        <span className="text-base-content font-medium">
                          {settings.totalStartingPlayers}
                        </span>
                      )}
                    </td>
                  </tr>
                  {/* row 3 */}
                  <tr className="">
                    <th className="text-base-content/80 font-normal border-r border-base-300 w-1/2">Allow Duplicate Draft Picks</th>
                    <td>
                      {isEditing ? (
                        <div className="form-control">
                          <label className="label cursor-pointer justify-start gap-3">
                            <input
                              type="checkbox"
                              checked={settings.allowDuplicatePicks}
                              onChange={(e) =>
                                handleInputChange("allowDuplicatePicks", e.target.checked)
                              }
                              className="toggle toggle-primary"
                            />
                            <span className="text-sm text-base-content/60">
                              {settings.allowDuplicatePicks ? "Allowed" : "Not Allowed"}
                            </span>
                          </label>
                        </div>
                      ) : (
                        <span className="badge badge-lg badge-outline">
                          {settings.allowDuplicatePicks ? "Allowed" : "Not Allowed"}
                        </span>
                      )}
                    </td>
                  </tr>
                  {/* row 4 */}
                  <tr className="">
                    <th className="text-base-content/80 font-normal border-r border-base-300 w-1/2">Number of Draftable Duplicates</th>
                    <td>
                      {isEditing ? (
                        <div className="form-control">
                          <select
                            value={settings.numberOfDuplicates.toString()}
                            onChange={(e) =>
                              handleInputChange("numberOfDuplicates", parseInt(e.target.value))
                            }
                            className="select select-bordered w-full max-w-xs focus:select-primary transition-all"
                            disabled={!settings.allowDuplicatePicks}
                          >
                            <option value="0">0</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                          </select>
                        </div>
                      ) : (
                        <span className="text-base-content font-medium">
                          {settings.numberOfDuplicates}
                        </span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Scoring Settings Section */}
          <div className="settings-section mx-6 px-4 py-8 border-t border-base-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
              <h2 className="text-2xl font-bold text-base-content">Scoring Settings</h2>
            </div>
            <div className="overflow-x-auto bg-base-200/50 rounded-xl p-4 shadow-inner">
              <table className="table table-zebra">
                <tbody>
                  {/* row 1 */}
                  <tr className="">
                    <th className="text-base-content/80 font-normal border-r border-base-300 w-1/2">Use Chemistry</th>
                    <td>
                      {isEditing ? (
                        <div className="form-control">
                          <label className="label cursor-pointer justify-start gap-3">
                            <input
                              type="checkbox"
                              checked={settings.useChemistry}
                              onChange={(e) =>
                                handleInputChange("useChemistry", e.target.checked)
                              }
                              className="toggle toggle-primary"
                            />
                            <span className="text-sm text-base-content/60">
                              {settings.useChemistry ? "Enabled" : "Disabled"}
                            </span>
                          </label>
                        </div>
                      ) : (
                        <span className="badge badge-lg badge-outline">
                          {settings.useChemistry ? "Enabled" : "Disabled"}
                        </span>
                      )}
                    </td>
                  </tr>
                  {/* row 2 */}
                  <tr className="">
                    <th className="text-base-content/80 font-normal border-r border-base-300 w-1/2">Chemistry Multiplier</th>
                    <td>
                      {isEditing ? (
                        <div className="form-control">
                          <select
                            value={settings.chemistryMultiplier.toString()}
                            onChange={(e) =>
                              handleInputChange("chemistryMultiplier", parseFloat(e.target.value))
                            }
                            className="select select-bordered w-full max-w-xs focus:select-primary transition-all"
                            disabled={!settings.useChemistry}
                          >
                            <option value="1">1x</option>
                            <option value="1.25">1.25x</option>
                            <option value="1.5">1.5x</option>
                            <option value="1.75">1.75x</option>
                            <option value="2">2x</option>
                            <option value="2.5">2.5x</option>
                            <option value="3">3x</option>
                          </select>
                        </div>
                      ) : (
                        <span className="text-base-content font-medium">
                          {settings.chemistryMultiplier}x
                        </span>
                      )}
                    </td>
                  </tr>
                  {/* row 3 */}
                  <tr className="">
                    <th className="text-base-content/80 font-normal border-r border-base-300 w-1/2">Use Big Plays</th>
                    <td>
                      {isEditing ? (
                        <div className="form-control">
                          <label className="label cursor-pointer justify-start gap-3">
                            <input
                              type="checkbox"
                              checked={settings.useBigPlays}
                              onChange={(e) =>
                                handleInputChange("useBigPlays", e.target.checked)
                              }
                              className="toggle toggle-primary"
                            />
                            <span className="text-sm text-base-content/60">
                              {settings.useBigPlays ? "Enabled" : "Disabled"}
                            </span>
                          </label>
                        </div>
                      ) : (
                        <span className="badge badge-lg badge-outline">
                          {settings.useBigPlays ? "Enabled" : "Disabled"}
                        </span>
                      )}
                    </td>
                  </tr>
                  {/* row 4 */}
                  <tr className="">
                    <th className="text-base-content/80 font-normal border-r border-base-300 w-1/2">Big Plays Multiplier</th>
                    <td>
                      {isEditing ? (
                        <div className="form-control">
                          <select
                            value={settings.bigPlaysMultiplier.toString()}
                            onChange={(e) =>
                              handleInputChange("bigPlaysMultiplier", parseFloat(e.target.value))
                            }
                            className="select select-bordered w-full max-w-xs focus:select-primary transition-all"
                            disabled={!settings.useBigPlays}
                          >
                            <option value="1.5">1.5x</option>
                            <option value="2">2x</option>
                            <option value="2.5">2.5x</option>
                            <option value="3">3x</option>
                            <option value="4">4x</option>
                            <option value="5">5x</option>
                          </select>
                        </div>
                      ) : (
                        <span className="text-base-content font-medium">
                          {settings.bigPlaysMultiplier}x
                        </span>
                      )}
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