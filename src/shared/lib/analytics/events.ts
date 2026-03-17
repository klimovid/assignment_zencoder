export type AnalyticsEvent =
  | { type: "view_visited"; view: string; role: string }
  | { type: "filter_applied"; filterType: string; value: string }
  | { type: "export_triggered"; format: "csv" | "ndjson"; view: string }
  | { type: "session_drilldown"; sessionId: string; fromView: string }
  | { type: "notification_opened" }
  | { type: "notification_read"; notificationId: string }
  | { type: "theme_changed"; theme: "light" | "dark" | "system" }
  | { type: "alert_configured"; alertType: string; threshold: number }
  | { type: "data_load_failed"; view: string; endpoint: string; status: number }
  | { type: "slow_query"; view: string; duration: number }
  | { type: "empty_result"; view: string; filters: string };
