"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { Skeleton } from "@shared/ui/skeleton";
import type { UserProfile, UserSettings } from "@entities/user/model/types";

interface SettingsPageProps {
  profile: UserProfile | null;
  settings: UserSettings | null;
  loading?: boolean;
}

export function SettingsPage({ profile, settings, loading = false }: SettingsPageProps) {
  if (loading || !profile || !settings) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Loading settings...</p>
        <Skeleton className="h-40 rounded-xl" />
      </div>
    );
  }

  const { data: user } = profile;
  const { data: prefs } = settings;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Profile (read-only) */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <SettingRow label="Name" value={user.name} />
          <SettingRow label="Email" value={user.email} />
          <SettingRow label="Role" value={user.role} />
          <SettingRow label="Organization" value={user.organization.name} />
          <SettingRow label="Teams" value={user.teams.map((t) => t.name).join(", ")} />
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <SettingRow label="Theme" value={prefs.theme} />
          <SettingRow label="Timezone" value={prefs.timezone} />
          <SettingRow label="Default View" value={prefs.default_view} />
          <SettingRow label="Default Date Range" value={prefs.default_date_range} />
          <SettingRow label="Language" value={prefs.language} />
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <SettingRow label="Email Digest" value={prefs.email_digest.frequency} />
          <SettingRow label="Digest Scope" value={prefs.email_digest.scope} />
        </CardContent>
      </Card>
    </div>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b pb-2 last:border-b-0 last:pb-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium capitalize">{value}</span>
    </div>
  );
}
