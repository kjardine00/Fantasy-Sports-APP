"use client";

import React, { useState, useEffect } from 'react';
import SettingsTableRow from './SettingsTableRow';
import { SettingsFormState } from '@/lib/types/settings_types';
import { 
  formatTimeDisplay, 
  getTodayDate, 
  getAvailableTimeOptions,
  getCurrentTime,
  isToday,
  convertUTCToLocal,
  convertLocalToUTC,
  combineDateAndTime,
} from '../utils/dateTimeUtils';
import ScheduleDraftModal from '@/app/league/components/ScheduleDraftModal';

interface DraftSettingsProps {
  settings: SettingsFormState;
  isEditing: boolean;
  isCommissioner: boolean;
  onInputChange: (field: keyof SettingsFormState, value: any) => void;
  onSaveDraftSettings: (draftSettings: {
    draftType: "snake" | "auction";
    draftDate: string;
    draftTime: string;
    timePerPick: number;
  }) => Promise<void>;
}

const DraftSettings = ({
  settings,
  isEditing,
  isCommissioner,
  onInputChange,
  onSaveDraftSettings,
}: DraftSettingsProps) => {
  const [draftDateLocal, setDraftDateLocal] = useState<string>("");
  const [isDraftScheduled, setIsDraftScheduled] = useState<boolean>(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);
  const [parsedDraftTime, setParsedDraftTime] = useState<string>("");
  
  useEffect(() => {
    if (settings.scheduledStart) {
      // Convert UTC from database to local time
      const local = convertUTCToLocal(settings.scheduledStart);
      if (local) {
        setDraftDateLocal(local.date);
        setParsedDraftTime(local.time);
        setIsDraftScheduled(true);
      } else {
        // Fallback: try parsing as-is (for backward compatibility)
        setDraftDateLocal("");
        setParsedDraftTime("");
        setIsDraftScheduled(false);
      }
    } else {
      setDraftDateLocal("");
      setParsedDraftTime("");
      setIsDraftScheduled(false);
    }
  }, [settings.scheduledStart]);

  // Auto-update time if it becomes invalid when date changes to today
  useEffect(() => {
    if (
      isEditing &&
      isDraftScheduled &&
      draftDateLocal &&
      isToday(draftDateLocal)
    ) {
      const currentTime = getCurrentTime();
      const availableTimes = getAvailableTimeOptions(draftDateLocal);
      
      // If time is set but in the past, or no time is set
      if (parsedDraftTime && parsedDraftTime < currentTime) {
        // Set to the next available time (first option in the filtered list)
        if (availableTimes.length > 0) {
          const nextAvailableTime = availableTimes[0].value;
          setParsedDraftTime(nextAvailableTime);
          // Convert local date/time to UTC for storage
          const utcString = convertLocalToUTC(draftDateLocal, nextAvailableTime);
          onInputChange("scheduledStart", utcString);
        } else {
          // No available times today, clear it
          setParsedDraftTime("");
          onInputChange("scheduledStart", "");
        }
      } else if (!parsedDraftTime && availableTimes.length > 0) {
        // No time set but we have available times - auto-select the first one
        const nextAvailableTime = availableTimes[0].value;
        setParsedDraftTime(nextAvailableTime);
        // Convert local date/time to UTC for storage
        const utcString = convertLocalToUTC(draftDateLocal, nextAvailableTime);
        onInputChange("scheduledStart", utcString);
      }
    }
  }, [draftDateLocal, isEditing, isDraftScheduled, parsedDraftTime, onInputChange]);

  const handleScheduleDraft = () => {
    setIsScheduleModalOpen(true);
  };

  const handleSaveDraftSettings = async (draftSettings: {
    draftType: "snake" | "auction";
    draftDate: string;
    draftTime: string;
    timePerPick: number;
  }) => {
    try {
      await onSaveDraftSettings(draftSettings);
      
      // Update local state after successful save
      setDraftDateLocal(draftSettings.draftDate);
      setIsDraftScheduled(draftSettings.draftDate && draftSettings.draftTime ? true : false);
    } catch (error) {
      // Error handling is done in the hook, just re-throw for modal
      throw error;
    }
  };

  const timeOptions = getAvailableTimeOptions(draftDateLocal);

  return (
    <div className="mx-6 px-4 py-8 border-t border-base-300">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
          <h2 className="text-2xl font-bold text-base-content">Draft Settings</h2>
        </div>
        {!isDraftScheduled && isCommissioner && !isEditing && (
          <button
            onClick={handleScheduleDraft}
            className="btn btn-primary rounded-full shadow-lg hover:shadow-xl transition-all duration-200 gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Schedule Draft
          </button>
        )}
      </div>
      <div className="bg-base-200/50 rounded-xl p-4 shadow-inner">
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <tbody>
              {/* Draft Type Row */}
              <SettingsTableRow
                label="Draft Type"
                isEditing={isEditing && isDraftScheduled}
                editComponent={
                  <select
                    value={settings.draftType}
                    onChange={(e) =>
                      onInputChange(
                        "draftType",
                        e.target.value as "snake" | "auction"
                      )
                    }
                    className="select select-bordered w-full max-w-xs focus:select-primary transition-all"
                  >
                    <option disabled={true}>Draft Type</option>
                    <option value="snake">Snake</option>
                    <option value="auction" disabled>
                      Auction (Coming Soon)
                    </option>
                  </select>
                }
                displayComponent={
                  <span className="badge badge-md badge-outline capitalize">
                    {settings.draftType}
                  </span>
                }
              />
              {/* Draft Date row */}
              <SettingsTableRow
                label="Draft Date"
                isEditing={isEditing && isDraftScheduled}
                editComponent={
                  <input
                    type="date"
                    value={draftDateLocal}
                    onChange={(e) => setDraftDateLocal(e.target.value)}
                    min={getTodayDate()}
                    className="input input-bordered input-md w-full max-w-xs focus:input-primary transition-all"
                  />
                }
                displayComponent={
                  <span className="text-base-content font-medium">
                    {draftDateLocal || (
                      <span className="text-base-content/50 italic">
                        Not set
                      </span>
                    )}
                  </span>
                }
              />
              {/* Draft Time row */}
              <SettingsTableRow
                label="Draft Time"
                isEditing={isEditing && isDraftScheduled}
                editComponent={
                  <div className="form-control">
                    <select
                      value={parsedDraftTime}
                      onChange={(e) => {
                        const selectedTime = e.target.value;
                        // Convert local date/time to UTC for storage
                        if (draftDateLocal && selectedTime) {
                          const utcString = convertLocalToUTC(draftDateLocal, selectedTime);
                          onInputChange("scheduledStart", utcString);
                        } else {
                          onInputChange("scheduledStart", "");
                        }
                      }}
                      className="select select-bordered w-full max-w-xs focus:select-primary transition-all"
                    >
                      <option value="">Select Time</option>
                      {timeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                }
                displayComponent={
                  <span className="text-base-content font-medium">
                    {parsedDraftTime ? (
                      formatTimeDisplay(parsedDraftTime)
                    ) : (
                      <span className="text-base-content/50 italic">
                        Not set
                      </span>
                    )}
                  </span>
                }
              />
              {/* Time per Pick row */}
              <SettingsTableRow
                label="Time per Pick"
                isEditing={isEditing && isDraftScheduled}
                editComponent={
                  <div className="form-control">
                    <select
                      value={settings.timePerPick.toString()}
                      onChange={(e) =>
                        onInputChange(
                          "timePerPick",
                          parseInt(e.target.value)
                        )
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
                }
                displayComponent={
                  <span className="text-base-content font-medium">
                    {settings.timePerPick < 60
                      ? `${settings.timePerPick} seconds`
                      : settings.timePerPick < 3600
                        ? `${settings.timePerPick / 60} minute${settings.timePerPick / 60 > 1 ? "s" : ""}`
                        : `${settings.timePerPick / 3600} hour${settings.timePerPick / 3600 > 1 ? "s" : ""}`}
                  </span>
                }
              />
            </tbody>
          </table>
        </div>
      </div>
      <ScheduleDraftModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSave={handleSaveDraftSettings}
        initialDraftType={settings.draftType}
        initialDraftDate={draftDateLocal}
        initialDraftTime={parsedDraftTime}
        initialTimePerPick={settings.timePerPick}
      />
    </div>
  );
};

export default DraftSettings;
