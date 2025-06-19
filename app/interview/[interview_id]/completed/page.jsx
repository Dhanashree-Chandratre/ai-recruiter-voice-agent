"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // Use anon key for client-side
);

export default function CompletedPage() {
  const [feedbackData, setFeedbackData] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const interview_id = params?.interview_id;

  useEffect(() => {
    // Try to load from sessionStorage
    const stored = sessionStorage.getItem("latestFeedback");
    if (stored) {
      setFeedbackData(JSON.parse(stored));
      setLoading(false);
    } else {
      // If not found, fetch from Supabase
      fetchFeedbackFromSupabase();
    }
    // eslint-disable-next-line
  }, []);

  async function fetchFeedbackFromSupabase() {
    if (!interview_id) {
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("interview-feedback")
      .select("*")
      .eq("interview_id", interview_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    console.log("Supabase fetch result:", { data, error });

    if (data) {
      setFeedbackData({
        userName: data.userName,
        jobPosition: data.jobPosition,
        feedback: data.feedback,
      });
    }
    setLoading(false);
  }

  if (loading) {
    return <div className="p-10 text-center">Loading feedback...</div>;
  }

  if (
    !feedbackData ||
    !feedbackData.feedback ||
    !feedbackData.feedback.rating
  ) {
    return <div className="p-10 text-center">No feedback data available.</div>;
  }

  const { userName, jobPosition, feedback: fb } = feedbackData;
  const { rating, summary, Recommendation, RecommendationMsg } = fb;

  // Calculate average score for display
  const avgScore = (
    (rating.technicalSkills +
      rating.communication +
      rating.problemSolving +
      rating.experience) /
    4
  ).toFixed(1);

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src="https://ui-avatars.com/api/?name=User&background=random"
          alt={userName}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h2 className="text-2xl font-bold">{userName}</h2>
          <div className="text-gray-500">{jobPosition || "Candidate"}</div>
        </div>
        <div className="ml-auto text-blue-700 text-3xl font-bold flex flex-col items-end">
          {avgScore}
          <span className="text-base font-normal text-gray-400">/10</span>
        </div>
      </div>

      {/* Skills Assessment */}
      <h3 className="font-semibold text-lg mb-2">Skills Assessment</h3>
      <div className="mb-4">
        <SkillBar label="Technical Skills" value={rating.technicalSkills} />
        <SkillBar label="Communication" value={rating.communication} />
        <SkillBar label="Problem Solving" value={rating.problemSolving} />
        <SkillBar label="Experience" value={rating.experience} />
      </div>

      {/* Performance Summary */}
      <h3 className="font-semibold text-lg mb-2">Performance Summary</h3>
      <div className="bg-gray-100 p-4 rounded mb-4 text-gray-700">
        {Array.isArray(summary)
          ? summary.map((line, idx) => (
              <div key={idx} className="mb-2">
                {line}
              </div>
            ))
          : summary}
      </div>

      {/* Recommendation */}
      <div
        className={`p-4 rounded flex items-center justify-between ${
          Recommendation === "Yes"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        <div>
          <div className="font-bold">
            {Recommendation === "Yes"
              ? "Recommended for Hire"
              : "Not Recommended"}
          </div>
          <div className="text-sm">{RecommendationMsg}</div>
        </div>
        {Recommendation === "Yes" && (
          <button className="bg-green-500 text-white px-4 py-2 rounded font-semibold">
            Proceed to Offer
          </button>
        )}
      </div>
    </div>
  );
}

function SkillBar({ label, value }) {
  return (
    <div className="mb-2">
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span className="font-semibold text-blue-700">{value}/10</span>
      </div>
      <div className="w-full bg-gray-200 rounded h-2">
        <div
          className="bg-blue-600 h-2 rounded"
          style={{ width: `${(value / 10) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}
