"use client";
import React, { useState } from "react";
import InterviewHeader from "./_components/InterviewHeader";
import { InterviewDataProvider } from "../../context/InterviewDataContext.jsx";

function InterviewLayout({ children }) {
  return (
    <InterviewDataProvider>
      <div className="min-h-screen bg-gray-50">
        <InterviewHeader />
        {children}
      </div>
    </InterviewDataProvider>
  );
}

export default InterviewLayout;
