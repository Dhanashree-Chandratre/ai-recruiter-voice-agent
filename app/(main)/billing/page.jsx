import React from "react";
import { Button } from "../../../components/ui/button.jsx";

// Sample user state (replace with real data as needed)
const userPlan = "Free";
const creditsUsed = 10;
const creditsLimit = 10;
const creditsLeft = Math.max(0, creditsLimit - creditsUsed);
const creditsExhausted = creditsLeft === 0;

const plans = [
  {
    name: "Free Tier",
    price: "$0",
    duration: "Forever (10 credits)",
    credits: 10,
    perks: ["10 AI Interviews", "Basic Support", "Access to core features"],
    highlight: userPlan === "Free",
  },
  {
    name: "Pro Plan",
    price: "$29/mo",
    duration: "Monthly",
    credits: 100,
    perks: [
      "100 AI Interviews/month",
      "Priority Support",
      "Advanced analytics",
      "Export results",
    ],
    highlight: userPlan === "Pro",
  },
  {
    name: "Enterprise",
    price: "Contact Us",
    duration: "Custom",
    credits: "Unlimited",
    perks: [
      "Unlimited AI Interviews",
      "Dedicated Account Manager",
      "Custom integrations",
      "SLAs & Compliance",
    ],
    highlight: userPlan === "Enterprise",
  },
];

export default function BillingPage() {
  return (
    <div className="w-full min-h-screen p-4 md:p-8 bg-white rounded-none shadow-none flex flex-col">
      <h2 className="text-2xl font-bold mb-6">Billing & Subscription</h2>
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Current Plan</h3>
        <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg mt-2">
          <div>
            <span className="font-bold text-primary">{userPlan}</span> (Active)
            <div className="text-sm text-gray-500">
              {userPlan === "Free"
                ? `Credits left: ${creditsLeft} / ${creditsLimit}`
                : userPlan === "Pro"
                ? "Renews: 2024-12-31"
                : "Custom Plan"}
            </div>
          </div>
          {creditsExhausted && (
            <span className="text-red-600 font-semibold">
              Free credits exhausted! Please upgrade.
            </span>
          )}
          <Button
            disabled={userPlan !== "Free" && !creditsExhausted}
            className="ml-4"
          >
            {userPlan === "Free" ? "Upgrade Plan" : "Manage Plan"}
          </Button>
        </div>
      </div>
      {creditsExhausted && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded text-red-700 font-medium">
          You have used all your free credits. Upgrade to continue scheduling
          interviews.
        </div>
      )}
      <div>
        <h3 className="text-lg font-semibold mb-4">Choose Your Plan</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, idx) => (
            <div
              key={plan.name}
              className={`border rounded-xl p-6 flex flex-col items-start bg-gray-50 ${
                plan.highlight ? "border-primary shadow" : "border-gray-200"
              }`}
            >
              <h4 className="text-xl font-bold mb-2">{plan.name}</h4>
              <div className="text-2xl font-bold mb-1 text-primary">
                {plan.price}
              </div>
              <div className="text-gray-500 mb-2">{plan.duration}</div>
              <div className="mb-2 font-medium">
                {typeof plan.credits === "number"
                  ? `${plan.credits} interviews`
                  : plan.credits}
              </div>
              <ul className="mb-4 text-sm text-gray-700 list-disc pl-5">
                {plan.perks.map((perk) => (
                  <li key={perk}>{perk}</li>
                ))}
              </ul>
              <Button
                variant={plan.highlight ? "default" : "outline"}
                disabled={plan.highlight}
                className="w-full mt-auto"
              >
                {plan.highlight ? "Current Plan" : "Choose Plan"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
