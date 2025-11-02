"use client";

import React from "react";
import { useLeague } from "../../LeagueContext";

interface ActiveMemberIndicatorProps {
  teamIcon: string;
  teamName: string;
  managerName: string;
  status: "active" | "inactive" | "absent";
  size?: "normal" | "large";
}

const ActiveMemberIndicator = ({
  teamIcon,
  teamName,
  managerName,
  status,
  size = "normal",
}: ActiveMemberIndicatorProps) => {

  const ringClass =
    status === "active"
      ? "ring-success ring-offset-base-100 ring-2 ring-offset-2"
      : "";

  const avatarSize = size === "large" ? "w-16" : "w-12";
  const padding = size === "large" ? "p-4" : "p-2";
  const gap = size === "large" ? "gap-4" : "gap-3";
  const textSize = size === "large" ? "text-lg" : "";
  const subtitleSize = size === "large" ? "text-base" : "text-sm";

  return (
    <div>
      <div className={`flex items-center ${gap} bg-base-200 ${padding} rounded-md`}>
        <div className={`avatar`}>
          <div className={`${avatarSize} rounded-full ${ringClass}`}>
            <div className="mask mask-squircle w-full h-full">
              <img src={teamIcon} alt={teamName} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
        <div>
          <div className={`font-bold ${textSize}`}>{managerName}</div>
          <div className={`${subtitleSize} opacity-50`}>{teamName}</div>
        </div>
      </div>
    </div>
  );
};

export default ActiveMemberIndicator;
