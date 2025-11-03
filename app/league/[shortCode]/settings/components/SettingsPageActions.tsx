import React from "react";

interface SettingsPageActionsProps {
  isEditing: boolean;
  isCommissioner: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const SettingsPageActions = ({
  isEditing,
  isCommissioner,
  onEdit,
  onSave,
  onCancel,
}: SettingsPageActionsProps) => {
  if (!isEditing && isCommissioner) {
    return (
      <button
        onClick={onEdit}
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
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        Edit Settings
      </button>
    );
  }

  return (
    <>
      <button
        onClick={onCancel}
        className="btn btn-ghost rounded-full hover:bg-base-200 transition-all duration-200"
      >
        Cancel
      </button>
      <button
        onClick={onSave}
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
            d="M5 13l4 4L19 7"
          />
        </svg>
        Save Changes
      </button>
    </>
  );
};

export default SettingsPageActions;

