"use client";

import { useProfile } from "@entities/user/api/useProfile";
import { useSettings } from "@entities/user/api/useSettings";
import { SettingsPage } from "@pages/settings/ui/SettingsPage";

export default function SettingsRoute() {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: settings, isLoading: settingsLoading } = useSettings();

  return (
    <SettingsPage
      profile={profile ?? null}
      settings={settings ?? null}
      loading={profileLoading || settingsLoading}
    />
  );
}
