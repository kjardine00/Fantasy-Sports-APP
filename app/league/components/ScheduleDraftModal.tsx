"use client";

import React, { useEffect, useState } from "react";

interface ScheduleDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (draftSettings: {
    draftType: "snake" | "auction";
    draftDate: string;
    draftTime: string;
    timePerPick: number;
  }) => void | Promise<void>;
  initialDraftType: "snake" | "auction";
  initialDraftDate: string;
  initialDraftTime: string;
  initialTimePerPick: number;
}

const ScheduleDraftModal = ({
  isOpen,
  onClose,
  onSave,
  initialDraftType,
  initialDraftDate,
  initialDraftTime,
  initialTimePerPick,
}: ScheduleDraftModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [draftType, setDraftType] = useState<"snake" | "auction">(
    initialDraftType
  );
  const [draftDate, setDraftDate] = useState<string>(initialDraftDate);
  const [draftTime, setDraftTime] = useState<string>(initialDraftTime);
  const [timePerPick, setTimePerPick] = useState<number>(initialTimePerPick);

  // Get today's date in YYYY-MM-DD format (local timezone, not UTC)
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get current time in HH:MM format
  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // Check if selected date is today
  const isToday = (date: string) => {
    return date === getTodayDate();
  };

  // Generate time options, filtering out past times if date is today
  const getAvailableTimeOptions = () => {
    const allTimes = [
      { value: "00:00", label: "12:00 AM" },
      { value: "00:15", label: "12:15 AM" },
      { value: "00:30", label: "12:30 AM" },
      { value: "00:45", label: "12:45 AM" },
      { value: "01:00", label: "1:00 AM" },
      { value: "01:15", label: "1:15 AM" },
      { value: "01:30", label: "1:30 AM" },
      { value: "01:45", label: "1:45 AM" },
      { value: "02:00", label: "2:00 AM" },
      { value: "02:15", label: "2:15 AM" },
      { value: "02:30", label: "2:30 AM" },
      { value: "02:45", label: "2:45 AM" },
      { value: "03:00", label: "3:00 AM" },
      { value: "03:15", label: "3:15 AM" },
      { value: "03:30", label: "3:30 AM" },
      { value: "03:45", label: "3:45 AM" },
      { value: "04:00", label: "4:00 AM" },
      { value: "04:15", label: "4:15 AM" },
      { value: "04:30", label: "4:30 AM" },
      { value: "04:45", label: "4:45 AM" },
      { value: "05:00", label: "5:00 AM" },
      { value: "05:15", label: "5:15 AM" },
      { value: "05:30", label: "5:30 AM" },
      { value: "05:45", label: "5:45 AM" },
      { value: "06:00", label: "6:00 AM" },
      { value: "06:15", label: "6:15 AM" },
      { value: "06:30", label: "6:30 AM" },
      { value: "06:45", label: "6:45 AM" },
      { value: "07:00", label: "7:00 AM" },
      { value: "07:15", label: "7:15 AM" },
      { value: "07:30", label: "7:30 AM" },
      { value: "07:45", label: "7:45 AM" },
      { value: "08:00", label: "8:00 AM" },
      { value: "08:15", label: "8:15 AM" },
      { value: "08:30", label: "8:30 AM" },
      { value: "08:45", label: "8:45 AM" },
      { value: "09:00", label: "9:00 AM" },
      { value: "09:15", label: "9:15 AM" },
      { value: "09:30", label: "9:30 AM" },
      { value: "09:45", label: "9:45 AM" },
      { value: "10:00", label: "10:00 AM" },
      { value: "10:15", label: "10:15 AM" },
      { value: "10:30", label: "10:30 AM" },
      { value: "10:45", label: "10:45 AM" },
      { value: "11:00", label: "11:00 AM" },
      { value: "11:15", label: "11:15 AM" },
      { value: "11:30", label: "11:30 AM" },
      { value: "11:45", label: "11:45 AM" },
      { value: "12:00", label: "12:00 PM" },
      { value: "12:15", label: "12:15 PM" },
      { value: "12:30", label: "12:30 PM" },
      { value: "12:45", label: "12:45 PM" },
      { value: "13:00", label: "1:00 PM" },
      { value: "13:15", label: "1:15 PM" },
      { value: "13:30", label: "1:30 PM" },
      { value: "13:45", label: "1:45 PM" },
      { value: "14:00", label: "2:00 PM" },
      { value: "14:15", label: "2:15 PM" },
      { value: "14:30", label: "2:30 PM" },
      { value: "14:45", label: "2:45 PM" },
      { value: "15:00", label: "3:00 PM" },
      { value: "15:15", label: "3:15 PM" },
      { value: "15:30", label: "3:30 PM" },
      { value: "15:45", label: "3:45 PM" },
      { value: "16:00", label: "4:00 PM" },
      { value: "16:15", label: "4:15 PM" },
      { value: "16:30", label: "4:30 PM" },
      { value: "16:45", label: "4:45 PM" },
      { value: "17:00", label: "5:00 PM" },
      { value: "17:15", label: "5:15 PM" },
      { value: "17:30", label: "5:30 PM" },
      { value: "17:45", label: "5:45 PM" },
      { value: "18:00", label: "6:00 PM" },
      { value: "18:15", label: "6:15 PM" },
      { value: "18:30", label: "6:30 PM" },
      { value: "18:45", label: "6:45 PM" },
      { value: "19:00", label: "7:00 PM" },
      { value: "19:15", label: "7:15 PM" },
      { value: "19:30", label: "7:30 PM" },
      { value: "19:45", label: "7:45 PM" },
      { value: "20:00", label: "8:00 PM" },
      { value: "20:15", label: "8:15 PM" },
      { value: "20:30", label: "8:30 PM" },
      { value: "20:45", label: "8:45 PM" },
      { value: "21:00", label: "9:00 PM" },
      { value: "21:15", label: "9:15 PM" },
      { value: "21:30", label: "9:30 PM" },
      { value: "21:45", label: "9:45 PM" },
      { value: "22:00", label: "10:00 PM" },
      { value: "22:15", label: "10:15 PM" },
      { value: "22:30", label: "10:30 PM" },
      { value: "22:45", label: "10:45 PM" },
      { value: "23:00", label: "11:00 PM" },
      { value: "23:15", label: "11:15 PM" },
      { value: "23:30", label: "11:30 PM" },
      { value: "23:45", label: "11:45 PM" },
    ];

    if (draftDate && isToday(draftDate)) {
      const currentTime = getCurrentTime();
      return allTimes.filter((time) => time.value >= currentTime);
    }

    return allTimes;
  };

  // Reset draftTime if it becomes invalid when date changes
  useEffect(() => {
    if (draftDate && isToday(draftDate) && draftTime) {
      const currentTime = getCurrentTime();
      if (draftTime < currentTime) {
        setDraftTime("");
      }
    }
  }, [draftDate, draftTime]);

  // Reset form when modal opens/closes or initial values change
  useEffect(() => {
    if (isOpen) {
      setDraftType(initialDraftType);
      setDraftDate(initialDraftDate);
      setDraftTime(initialDraftTime);
      setTimePerPick(initialTimePerPick);
    }
  }, [
    isOpen,
    initialDraftType,
    initialDraftDate,
    initialDraftTime,
    initialTimePerPick,
  ]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isProcessing) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }
  }, [isOpen, onClose, isProcessing]);

  const handleSave = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      await onSave({
        draftType,
        draftDate,
        draftTime,
        timePerPick,
      });
      onClose();
    } catch (error) {
      console.error("Error saving draft settings:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  const isDisabled = isProcessing;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        onClick={!isDisabled ? onClose : undefined}
      />
      <div className="relative z-10">
        <div className="card w-full max-w-3xl bg-base-100 shadow-xl">
          <div className="card-body">
            {/* Header with Title and X button */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="card-title text-2xl">Schedule Draft</h2>
              <button
                className="btn btn-ghost btn-circle"
                onClick={onClose}
                disabled={isDisabled}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Draft Settings Form */}
            <div className="space-y-4">
              {/* Draft Type */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Draft Type</span>
                </label>
                <select
                  value={draftType}
                  onChange={(e) =>
                    setDraftType(e.target.value as "snake" | "auction")
                  }
                  className="select select-bordered w-full focus:select-primary transition-all"
                  disabled={isDisabled}
                >
                  <option disabled={true}>Draft Type</option>
                  <option value="snake">Snake</option>
                  <option value="auction" disabled>
                    Auction (Coming Soon)
                  </option>
                </select>
              </div>

              {/* Draft Date */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Draft Date</span>
                </label>
                <input
                  type="date"
                  value={draftDate}
                  onChange={(e) => setDraftDate(e.target.value)}
                  min={getTodayDate()}
                  className="input input-bordered w-full focus:input-primary transition-all"
                  disabled={isDisabled}
                />
              </div>

              {/* Draft Time */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Draft Time</span>
                </label>
                <select
                  value={draftTime}
                  onChange={(e) => setDraftTime(e.target.value)}
                  className="select select-bordered w-full focus:select-primary transition-all"
                  disabled={isDisabled || !draftDate}
                >
                  <option value="">Select Time</option>
                  {getAvailableTimeOptions().map((time) => (
                    <option key={time.value} value={time.value}>
                      {time.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time per Pick */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Time per Pick
                  </span>
                </label>
                <select
                  value={timePerPick.toString()}
                  onChange={(e) => setTimePerPick(parseInt(e.target.value))}
                  className="select select-bordered w-full focus:select-primary transition-all"
                  disabled={isDisabled}
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
            </div>

            {/* Footer with Save button */}
            <div className="flex justify-end mt-6">
              <button
                className="btn btn-primary rounded-full shadow-lg hover:shadow-xl transition-all duration-200 gap-2"
                onClick={handleSave}
                disabled={isDisabled}
              >
                {isDisabled ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Saving...
                  </>
                ) : (
                  <>
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Save
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleDraftModal;
