import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAlert } from "@/app/components/Alert/AlertContext";
import { AlertType } from "@/lib/types/alert_types";
import {
  fetchLeagueSettingsAction,
  updateLeagueSettingsAction,
  scheduleDraftAction,
} from "@/lib/server_actions/leagues_actions";
import { SettingsFormState } from "@/lib/types/settings_types";
import { combineDateAndTime, convertLocalToUTC } from "../utils/dateTimeUtils";

interface UseSettingsStateProps {
  leagueId: string | undefined;
  leagueShortCode: string;
  defaultSettings: SettingsFormState;
}

interface DraftSettingsInput {
  draftType: "snake" | "auction";
  draftDate: string;
  draftTime: string;
  timePerPick: number;
}

interface UseSettingsStateReturn {
  isLoading: boolean;
  isEditing: boolean;
  settings: SettingsFormState;
  handleEdit: () => void;
  handleSave: () => Promise<void>;
  handleCancel: () => void;
  handleInputChange: (field: keyof SettingsFormState, value: any) => void;
  saveDraftSettings: (draftSettings: DraftSettingsInput) => Promise<void>;
  hasChanges: boolean;
}

export const useSettingsState = ({
  leagueId,
  leagueShortCode,
  defaultSettings,
}: UseSettingsStateProps): UseSettingsStateReturn => {
  const router = useRouter();
  const { addAlert } = useAlert();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [originalSettings, setOriginalSettings] = useState<SettingsFormState>();
  const [settings, setSettings] = useState<SettingsFormState>(defaultSettings);

  // Fetch settings from database on mount
  useEffect(() => {
    const fetchSettings = async () => {
      if (!leagueId) return;

      try {
        setIsLoading(true);
        const currentSettings = await fetchLeagueSettingsAction(leagueId);

        setSettings(currentSettings);
        setOriginalSettings(currentSettings);
      } catch (error) {
        addAlert({
          message: String(error),
          type: AlertType.ERROR,
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, [leagueId, addAlert]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!leagueId) return;

    // Check if there are any changes before saving
    const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);
    if (!hasChanges) {
      // No changes, just exit edit mode
      setIsEditing(false);
      return;
    }

    // Optimistically update state immediately (before API call completes)
    // This makes the UI feel more responsive
    const previousSettings = originalSettings;
    setOriginalSettings(settings);
    setIsEditing(false);

    try {
      await updateLeagueSettingsAction(leagueId, settings);

      // Show success message and redirect to league page
      addAlert({
        message: "Settings saved successfully",
        type: AlertType.SUCCESS,
        duration: 3000,
      });
      
      // Redirect to league page after save
      router.push(`/league/${leagueShortCode}`);
    } catch (error) {
      // Rollback optimistic update on error
      if (previousSettings) {
        setSettings(previousSettings);
        setOriginalSettings(previousSettings);
      }
      setIsEditing(true); // Put back in edit mode on error

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

  const handleInputChange = (field: keyof SettingsFormState, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const saveDraftSettings = async (draftSettings: DraftSettingsInput) => {
    if (!leagueId) return;

    try {
      // Convert local date/time to UTC for database storage
      const scheduledStart = convertLocalToUTC(
        draftSettings.draftDate,
        draftSettings.draftTime
      );

      // Update settings with draft configuration
      const updatedSettings: SettingsFormState = {
        ...settings,
        draftType: draftSettings.draftType,
        scheduledStart,
        timePerPick: draftSettings.timePerPick,
      };

      // Use scheduleDraftAction which creates draft if it doesn't exist
      await scheduleDraftAction(leagueId, updatedSettings);

      // Update local state
      setSettings(updatedSettings);
      setOriginalSettings(updatedSettings);

      addAlert({
        message: "Draft scheduled successfully",
        type: AlertType.SUCCESS,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error saving draft settings:", error);
      addAlert({
        message: "Error saving draft settings",
        type: AlertType.ERROR,
        duration: 3000,
      });
      throw error; // Re-throw so modal can handle it
    }
  };

  // Check if settings have changed from original
  const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);

  return {
    isLoading,
    isEditing,
    settings,
    handleEdit,
    handleSave,
    handleCancel,
    handleInputChange,
    saveDraftSettings,
    hasChanges,
  };
};

