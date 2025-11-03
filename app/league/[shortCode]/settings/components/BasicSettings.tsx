import React from 'react';
import { PageSection } from '@/app/components/Layout';
import SettingsTableRow from './SettingsTableRow';
import { SettingsFormState } from '@/lib/types/settings_types';

interface BasicSettingsProps {
    settings: SettingsFormState;
    isEditing: boolean;
    onInputChange: (field: keyof SettingsFormState, value: any) => void;
}

const BasicSettings = ({ settings, isEditing, onInputChange } : BasicSettingsProps) => {
  return (
    <PageSection title="Basic Settings">
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <tbody>
            <SettingsTableRow
                label="League Name"
                isEditing={isEditing}
                editComponent={
                  <label className="floating-label">
                    <input
                      type="text"
                      value={settings.leagueName}
                      onChange={(e) =>
                        onInputChange("leagueName", e.target.value)
                      }
                      className="input input-bordered input-md w-full max-w-xs focus:input-primary transition-all"
                    />
                  </label>
                }
                displayComponent={
                  <span className="text-base-content font-medium">
                    {settings.leagueName}
                  </span>
                }
              />
              <SettingsTableRow
                label="Number of Teams"
                isEditing={isEditing}
                editComponent={
                  <div className="form-control">
                    <select
                      value={settings.numberOfTeams.toString()}
                      onChange={(e) =>
                        onInputChange(
                          "numberOfTeams",
                          parseInt(e.target.value)
                        )
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
                }
                displayComponent={
                  <span className="text-base-content font-medium">
                    {settings.numberOfTeams}
                  </span>
                }
              />
              <SettingsTableRow
                label="Make League Viewable to Public"
                isEditing={isEditing}
                editComponent={
                  <div className="form-control">
                    <label className="label cursor-not-allowed justify-start gap-3">
                      <input
                        type="checkbox"
                        checked={settings.isPublic}
                        onChange={(e) =>
                          onInputChange("isPublic", e.target.checked)
                        }
                        className="toggle toggle-primary opacity-50"
                        disabled
                      />
                      <span className="text-sm text-base-content/40 italic">
                        Coming Soon
                      </span>
                    </label>
                  </div>
                }
                displayComponent={
                  <span className="badge badge-md badge-outline">
                    {settings.isPublic ? "Public" : "Private"}
                  </span>
                }
              />
            </tbody>
          </table>
        </div>
      </PageSection>
  )
}

export default BasicSettings