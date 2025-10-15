"use client";

import React from "react";
import { useAlert } from "../components/Alert/AlertContext";
import { AlertType } from "@/lib/types/alert_types";

const testComponent = () => {
  const { addAlert } = useAlert();

  const handleClick = ( type: AlertType ) => {
    switch (type) {
      case AlertType.INFO:
        addAlert({
          message: "INFO",
          type: type,
          id: "1",
          duration: 1000,
        })
        break;
      case AlertType.SUCCESS:
        addAlert({
          message: "SUCCESS",
          type: type,
          id: "1",
          duration: 3000,
        })
        break;
      case AlertType.ERROR:
        addAlert({
          message: "ERROR",
          type: type,
          id: "1",
          duration: 2000,
        })
        break;
      case AlertType.WARNING:
        addAlert({
          message: "WARNING",
          type: type,
          id: "1",
          duration: 4000,
        })
        break;
    }
  }

  return (
    <>
      <button className="btn btn-info" onClick={() => handleClick(AlertType.INFO)}>INFO</button>
      <button className="btn btn-success" onClick={() => handleClick(AlertType.SUCCESS)}>SUCCESS</button>
      <button className="btn btn-error" onClick={() => handleClick(AlertType.ERROR)}>ERROR</button>
      <button className="btn btn-warning" onClick={() => handleClick(AlertType.WARNING)}>WARNING</button>
    </>
  );
};

export default testComponent;
