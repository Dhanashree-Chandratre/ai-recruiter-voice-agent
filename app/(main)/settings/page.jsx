"use client";
import React, { useState } from "react";
import { Button } from "../../../components/ui/button.jsx";

// Placeholder user data (replace with real user context)
const user = {
  username: "john_doe",
  email: "john.doe@example.com",
};

const services = [
  "AI Interview Feedback",
  "Candidate Management",
  "Billing & Invoices",
  "Notifications",
];

export default function SettingsPage() {
  const [theme, setTheme] = useState("light");

  const handleThemeToggle = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
    // Optionally, add logic to update the actual app theme
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-8 bg-white dark:bg-gray-900 rounded-none shadow-none flex flex-col">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Settings
      </h2>
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
          Profile Information
        </h3>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="mb-2">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Username:
            </span>{" "}
            <span className="text-gray-900 dark:text-gray-100">
              {user.username}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Email:
            </span>{" "}
            <span className="text-gray-900 dark:text-gray-100">
              {user.email}
            </span>
          </div>
        </div>
      </div>
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
          Appearance
        </h3>
        <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            Theme:
          </span>
          <Button variant="outline" onClick={handleThemeToggle}>
            {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          </Button>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
          Services
        </h3>
        <ul className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg list-disc pl-5 text-gray-700 dark:text-gray-200">
          {services.map((service) => (
            <li key={service}>{service}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
