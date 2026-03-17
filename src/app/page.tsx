import { redirect } from "next/navigation";
import { DASHBOARD_ROUTES } from "@shared/config/routes";

export default function Home() {
  redirect(DASHBOARD_ROUTES.dashboard);
}
