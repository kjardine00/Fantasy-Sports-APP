import React from "react";
import { AlertType } from "@/lib/types/alert_types";

const getAlertIcon = (type: AlertType): string => {
  switch (type) {
    case AlertType.INFO:
      return "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z";
    case AlertType.SUCCESS:
      return "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z";
    case AlertType.WARNING:
      return "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z";
    case AlertType.ERROR:
      return "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z";
    default:
      return "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z";
  }
};

const Alert = ( {error, type}: {error: string, type: AlertType} ) => {

  console.log(`${type}: ${error}`)
  return (
    <div role="alert" className={`alert alert-${type}`}>
      <svg
        className="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d={getAlertIcon(type)}
        />
      </svg>
      <span>{`${type}: ${error}`}</span>
    </div>
  );
};

export default Alert;