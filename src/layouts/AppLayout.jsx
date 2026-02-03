import { Outlet } from "react-router-dom";
import AppHeader from "../ui/AppHeader";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />
      <main className="pt-6">
        <Outlet />
      </main>
    </div>
  );
}