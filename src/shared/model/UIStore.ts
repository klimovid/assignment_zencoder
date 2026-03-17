import { makeAutoObservable } from "mobx";

const STORAGE_KEY = "ui:sidebarCollapsed";

export class UIStore {
  sidebarCollapsed = false;
  isMobile = false;

  constructor() {
    makeAutoObservable(this);

    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        this.sidebarCollapsed = JSON.parse(saved);
      }
    }
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.sidebarCollapsed));
    }
  }

  setMobile(isMobile: boolean) {
    this.isMobile = isMobile;
  }
}
