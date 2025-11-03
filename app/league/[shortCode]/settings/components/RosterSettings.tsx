import React from "react";
import { PageSection } from "@/app/components/Layout";
import SettingsTableRow from "./SettingsTableRow";
import { SettingsFormState } from "@/lib/types/settings_types";

interface RosterSettingsProps {
  settings: SettingsFormState;
  isEditing: boolean;
  onInputChange: (field: keyof SettingsFormState, value: any) => void;
}

const RosterSettings = ({
  settings,
  isEditing,
  onInputChange,
}: RosterSettingsProps) => {
  return (
    <PageSection title="Roster Settings" showBorderTop>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <tbody>
            <SettingsTableRow
              label="Roster Size"
              isEditing={isEditing}
              editComponent={
                <div className="form-control">
                  <select
                    value={settings.rosterSize.toString()}
                    onChange={(e) =>
                      onInputChange("rosterSize", parseInt(e.target.value))
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
              }
              displayComponent={
                <span className="text-base-content font-medium">
                  {settings.rosterSize}
                </span>
              }
            />
            <SettingsTableRow
              label="Total Starting Players"
              isEditing={isEditing}
              editComponent={
                <div className="form-control">
                  <select
                    value={settings.totalStartingPlayers.toString()}
                    onChange={(e) =>
                      onInputChange(
                        "totalStartingPlayers",
                        parseInt(e.target.value)
                      )
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
              }
              displayComponent={
                <span className="text-base-content font-medium">
                  {settings.totalStartingPlayers}
                </span>
              }
            />
            <SettingsTableRow
              label="Allow Duplicate Draft Picks"
              isEditing={isEditing}
              editComponent={
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-3">
                    <input
                      type="checkbox"
                      checked={settings.allowDuplicatePicks}
                      onChange={(e) =>
                        onInputChange("allowDuplicatePicks", e.target.checked)
                      }
                      className="toggle toggle-primary"
                    />
                    <span className="text-sm text-base-content/60">
                      {settings.allowDuplicatePicks ? "Allowed" : "Not Allowed"}
                    </span>
                  </label>
                </div>
              }
              displayComponent={
                <span className="badge badge-md badge-outline">
                  {settings.allowDuplicatePicks ? "Allowed" : "Not Allowed"}
                </span>
              }
            />
            <SettingsTableRow
              label="Number of Draftable Duplicates"
              isEditing={isEditing}
              editComponent={
                <div className="form-control">
                  <select
                    value={settings.numberOfDuplicates.toString()}
                    onChange={(e) =>
                      onInputChange(
                        "numberOfDuplicates",
                        parseInt(e.target.value)
                      )
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
              }
              displayComponent={
                <span className="text-base-content font-medium">
                  {settings.numberOfDuplicates}
                </span>
              }
            />
          </tbody>
        </table>
      </div>
    </PageSection>
  );
};

export default RosterSettings;