import React from "react";
import { PageSection } from "@/app/components/Layout";
import SettingsTableRow from "./SettingsTableRow";
import { SettingsFormState } from "@/lib/types/settings_types";

interface ScoringSettingsProps {
  settings: SettingsFormState;
  isEditing: boolean;
  onInputChange: (field: keyof SettingsFormState, value: any) => void;
}

const ScoringSettings = ({
  settings,
  isEditing,
  onInputChange,
}: ScoringSettingsProps) => {
  return (
    <PageSection title="Scoring Settings" showBorderTop>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <tbody>
            <SettingsTableRow
              label="Use Chemistry"
              isEditing={isEditing}
              editComponent={
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-3">
                    <input
                      type="checkbox"
                      checked={settings.useChemistry}
                      onChange={(e) =>
                        onInputChange("useChemistry", e.target.checked)
                      }
                      className="toggle toggle-primary"
                    />
                    <span className="text-sm text-base-content/60">
                      {settings.useChemistry ? "Enabled" : "Disabled"}
                    </span>
                  </label>
                </div>
              }
              displayComponent={
                <span className="badge badge-md badge-outline">
                  {settings.useChemistry ? "Enabled" : "Disabled"}
                </span>
              }
            />
            <SettingsTableRow
              label="Chemistry Multiplier"
              isEditing={isEditing}
              editComponent={
                <div className="form-control">
                  <select
                    value={settings.chemistryMultiplier.toString()}
                    onChange={(e) =>
                      onInputChange(
                        "chemistryMultiplier",
                        parseFloat(e.target.value)
                      )
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
              }
              displayComponent={
                <span className="text-base-content font-medium">
                  {settings.chemistryMultiplier}x
                </span>
              }
            />
            <SettingsTableRow
              label="Use Big Plays"
              isEditing={isEditing}
              editComponent={
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-3">
                    <input
                      type="checkbox"
                      checked={settings.useBigPlays}
                      onChange={(e) =>
                        onInputChange("useBigPlays", e.target.checked)
                      }
                      className="toggle toggle-primary"
                    />
                    <span className="text-sm text-base-content/60">
                      {settings.useBigPlays ? "Enabled" : "Disabled"}
                    </span>
                  </label>
                </div>
              }
              displayComponent={
                <span className="badge badge-md badge-outline">
                  {settings.useBigPlays ? "Enabled" : "Disabled"}
                </span>
              }
            />
            <SettingsTableRow
              label="Big Plays Multiplier"
              isEditing={isEditing}
              editComponent={
                <div className="form-control">
                  <select
                    value={settings.bigPlaysMultiplier.toString()}
                    onChange={(e) =>
                      onInputChange(
                        "bigPlaysMultiplier",
                        parseFloat(e.target.value)
                      )
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
              }
              displayComponent={
                <span className="text-base-content font-medium">
                  {settings.bigPlaysMultiplier}x
                </span>
              }
            />
          </tbody>
        </table>
      </div>
    </PageSection>
  );
};

export default ScoringSettings;
