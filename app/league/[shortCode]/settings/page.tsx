"use client";

import React from "react";
import { useLeague } from "../LeagueContext";
import { SettingsFormState } from "@/lib/types/settings_types";
import {
  PageContainer,
  PageHeader,
} from "@/app/components/Layout";
import BasicSettings from "./components/BasicSettings";
import DraftSettings from "./components/DraftSettings";
import RosterSettings from "./components/RosterSettings";
import ScoringSettings from "./components/ScoringSettings";
import SettingsPageActions from "./components/SettingsPageActions";
import { useSettingsState } from "./hooks/useSettingsState";

const SettingsPage = () => {
  const { league, isCommissioner } = useLeague();

  const {
    isLoading,
    isEditing,
    settings,
    handleEdit,
    handleSave,
    handleCancel,
    handleInputChange,
    saveDraftSettings,
  } = useSettingsState({
    leagueId: league.id,
    leagueShortCode: league.short_code,
    defaultSettings: {
      leagueName: league.name,
      numberOfTeams: 10,
      isPublic: false,
      draftType: "snake",
      scheduledStart: "",
      timePerPick: 90,
      rosterSize: 10,
      totalStartingPlayers: 6,
      allowDuplicatePicks: false,
      numberOfDuplicates: 0,
      useChemistry: true,
      chemistryMultiplier: 1.5,
      useBigPlays: false,
      bigPlaysMultiplier: 2,
    },
  });

  if (isLoading) {
    return <PageContainer isLoading />;
  }

  return (
    <PageContainer>
      <PageHeader
        title="League Settings"
        breadcrumb={{
          label: `${league.name} page`,
          href: `/league/${league.short_code}`,
        }}
        actions={
          <SettingsPageActions
            isEditing={isEditing}
            isCommissioner={isCommissioner}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        }
      />
      <BasicSettings
        settings={settings}
        isEditing={isEditing}
        onInputChange={handleInputChange}
      />
      <DraftSettings
        settings={settings}
        isEditing={isEditing}
        isCommissioner={isCommissioner}
        onInputChange={handleInputChange}
        onSaveDraftSettings={saveDraftSettings}
      />
      <RosterSettings
        settings={settings}
        isEditing={isEditing}
        onInputChange={handleInputChange}
      />
      <ScoringSettings
        settings={settings}
        isEditing={isEditing}
        onInputChange={handleInputChange}
      />
    </PageContainer>
  );
};

export default SettingsPage;
