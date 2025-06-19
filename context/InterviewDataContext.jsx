"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

export const InterviewDataContext = createContext(null);

export function InterviewDataProvider({ children }) {
  const [interviewData, setInterviewData] = useState(null);
  const [userName, setUserName] = useState("");

  // Restore from sessionStorage on mount
  useEffect(() => {
    if (!interviewData) {
      const stored = sessionStorage.getItem("interviewData");
      if (stored) setInterviewData(JSON.parse(stored));
    }
    if (!userName) {
      const storedName = sessionStorage.getItem("userName");
      if (storedName) setUserName(storedName);
    }
  }, []);

  // Persist to sessionStorage whenever interviewData changes
  useEffect(() => {
    if (interviewData) {
      sessionStorage.setItem("interviewData", JSON.stringify(interviewData));
    }
  }, [interviewData]);

  // Persist to sessionStorage whenever userName changes
  useEffect(() => {
    if (userName) {
      sessionStorage.setItem("userName", userName);
    }
  }, [userName]);

  const value = {
    interviewData,
    setInterviewData,
    userName,
    setUserName,
  };

  return (
    <InterviewDataContext.Provider value={value}>
      {children}
    </InterviewDataContext.Provider>
  );
}

export function useInterviewData() {
  const context = useContext(InterviewDataContext);
  if (!context) {
    throw new Error(
      "useInterviewData must be used within an InterviewDataProvider"
    );
  }
  return context;
}
