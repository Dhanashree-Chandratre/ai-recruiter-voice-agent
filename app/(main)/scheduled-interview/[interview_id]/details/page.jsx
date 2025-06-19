"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "../../../provider.js";
import { supabase } from "../../../../../services/supabaseClient.js";
import InterviewDetailContainer from "./_components/InterviewDetailContainer";
import CandidatesList from "./_components/CandidatesList";

function InterviewDetail() {
  const { interview_id } = useParams();
  const { user } = useUser();
  const [interviewDetail, setInterviewDetail] = useState();

  useEffect(() => {
    user && GetInterviewDetail();
  }, [user]);

  const GetInterviewDetail = async () => {
    // Fetch interview details
    const interviewResult = await supabase
      .from("interviews")
      .select(
        `jobPosition, jobDescription, type, questionList, duration, interview_id, created_at, interview-feedback(userEmail,userName,feedback,created_at)`
      )
      .eq("userEmail", user?.email)
      .eq("interview_id", interview_id);

    setInterviewDetail(interviewResult?.data[0]);

    // Fetch feedbacks for this interview
    const feedbackResult = await supabase
      .from("interview-feedback")
      .select("*")
      .eq("interview_id", interview_id);

    console.log("Interview:", interviewResult);
    console.log("Feedbacks:", feedbackResult);
  };
  return (
    <div>
      <h2 className="mt-12 font-bold text-2xl">Interview Details</h2>
      <InterviewDetailContainer interviewDetail={interviewDetail} />
      <CandidatesList
        candidatesList={interviewDetail?.["interview-feedback"]}
      />
    </div>
  );
}

export default InterviewDetail;
