import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <>
      {/* The <Outlet /> renders the child route (e.g., LoginPage) */}
      <Outlet />
    </>
  );
}
