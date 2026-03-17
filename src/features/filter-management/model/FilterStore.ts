import { makeAutoObservable } from "mobx";

export type TaskType = "bugfix" | "feature" | "refactor" | "test" | "ops";
export type Granularity = "hourly" | "daily" | "weekly" | "monthly";

export interface FilterState {
  teamIds: string[];
  repoIds: string[];
  model: string | null;
  taskType: TaskType | null;
  language: string | null;
  timeRange: string;
  granularity: Granularity;
  comparison: boolean;
}

const DEFAULTS: FilterState = {
  teamIds: [],
  repoIds: [],
  model: null,
  taskType: null,
  language: null,
  timeRange: "30d",
  granularity: "daily",
  comparison: false,
};

export class FilterStore {
  teamIds: string[] = [];
  repoIds: string[] = [];
  model: string | null = null;
  taskType: TaskType | null = null;
  language: string | null = null;
  timeRange = "30d";
  granularity: Granularity = "daily";
  comparison = false;

  constructor() {
    makeAutoObservable(this);
  }

  setFilter<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this as any)[key] = value;
  }

  resetFilters() {
    Object.assign(this, { ...DEFAULTS, teamIds: [], repoIds: [] });
  }

  get serialized(): FilterState {
    return {
      teamIds: [...this.teamIds],
      repoIds: [...this.repoIds],
      model: this.model,
      taskType: this.taskType,
      language: this.language,
      timeRange: this.timeRange,
      granularity: this.granularity,
      comparison: this.comparison,
    };
  }

  get hasActiveFilters(): boolean {
    return (
      this.teamIds.length > 0 ||
      this.repoIds.length > 0 ||
      this.model !== null ||
      this.taskType !== null ||
      this.language !== null
    );
  }
}
