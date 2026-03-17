import { makeAutoObservable } from "mobx";
import type { Role } from "@shared/config/permissions";

interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface AuthData {
  user: AuthUser;
  role: Role;
  orgId: string;
  teams: string[];
  permissions: string[];
}

export class AuthStore {
  user: AuthUser | null = null;
  role: Role | null = null;
  orgId: string | null = null;
  teams: string[] = [];
  permissions: string[] = [];
  initialized = false;

  constructor() {
    makeAutoObservable(this);
  }

  setAuth(data: AuthData) {
    this.user = data.user;
    this.role = data.role;
    this.orgId = data.orgId;
    this.teams = data.teams;
    this.permissions = data.permissions;
    this.initialized = true;
  }

  get isAuthenticated(): boolean {
    return this.user !== null;
  }

  hasPermission(permission: string): boolean {
    return this.role === "org_admin" || this.permissions.includes(permission);
  }

  logout() {
    this.user = null;
    this.role = null;
    this.orgId = null;
    this.teams = [];
    this.permissions = [];
    this.initialized = false;
  }
}
