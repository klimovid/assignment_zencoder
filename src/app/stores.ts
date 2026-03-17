import { AuthStore } from "@features/auth/model/AuthStore";
import { FilterStore } from "@features/filter-management/model/FilterStore";
import { UIStore } from "@shared/model/UIStore";
import { NotificationStore } from "@entities/notification/model/NotificationStore";
import { UserSettingsStore } from "@entities/user/model/UserSettingsStore";

export class RootStore {
  readonly auth: AuthStore;
  readonly filter: FilterStore;
  readonly ui: UIStore;
  readonly notifications: NotificationStore;
  readonly settings: UserSettingsStore;

  constructor() {
    this.auth = new AuthStore();
    this.filter = new FilterStore();
    this.ui = new UIStore();
    this.notifications = new NotificationStore();
    this.settings = new UserSettingsStore();
  }
}

export function createRootStore(): RootStore {
  return new RootStore();
}
