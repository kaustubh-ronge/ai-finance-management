import React, { Suspense } from "react";
import DashboardPage from "./page";
import { BarLoader } from "react-spinners";

const DashboardLayout = () => {
  return (
    <div className="px-5">
      <div className="text-6xl font-bold gradient-title mb-5">
        <h1>Dashboard</h1>
      </div>

      {/* dashboard page  */}
      <Suspense
        fallback={<BarLoader className="nt-4" width={"100%"} color="#9333ea" />}
      >
        <DashboardPage />
      </Suspense>
    </div>
  );
};

export default DashboardLayout;
