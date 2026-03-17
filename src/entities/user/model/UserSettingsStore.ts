import { makeAutoObservable } from "mobx";

type Theme = "light" | "dark" | "system";
type DefaultView = "executive-overview" | "adoption" | "delivery" | "cost" | "quality" | "operations";
type DateRange = "7d" | "30d" | "90d" | "custom";

interface APISettings {
  theme?: Theme;
  timezone?: string;
  default_view?: DefaultView;
  default_date_range?: DateRange;
}

export class UserSettingsStore {
  theme: Theme = "system";
  timezone = "UTC";
  defaultView: DefaultView = "executive-overview";
  defaultDateRange: DateRange = "30d";

  constructor() {
    makeAutoObservable(this);
  }

  setTheme(theme: Theme) {
    this.theme = theme;
  }

  setTimezone(timezone: string) {
    this.timezone = timezone;
  }

  setDefaultView(view: DefaultView) {
    this.defaultView = view;
  }

  setDefaultDateRange(range: DateRange) {
    this.defaultDateRange = range;
  }

  applyFromAPI(settings: APISettings) {
    if (settings.theme !== undefined) this.theme = settings.theme;
    if (settings.timezone !== undefined) this.timezone = settings.timezone;
    if (settings.default_view !== undefined) this.defaultView = settings.default_view;
    if (settings.default_date_range !== undefined) this.defaultDateRange = settings.default_date_range;
  }
}
