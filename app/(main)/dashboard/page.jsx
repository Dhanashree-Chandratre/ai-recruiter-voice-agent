import React from "react";
import CreateOptions from "./_components/CreateOptions";
import LatestInterviewsList from "./_components/LatestInterviewsList";
import WelcomeContainer from "./_components/WelcomeContainer";

function Dashboard() {
  return (
    <div className="w-full space-y-6">
      <h2 className="mt-12 mb-3 text-2xl font-bold w-full">Dashboard</h2>
      <CreateOptions />
      <LatestInterviewsList />
    </div>
  );
}

export default Dashboard;
