"use client";
import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Progress } from "../../../../components/ui/progress.jsx";
import FormContainer from "./_components/FormContainer";
import QuestionList from "./_components/QuestionList";
import InterviewLink from "./_components/InterviewLink";
import { toast } from "sonner";

function CreateInterview() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [interviewId, setInterviewId] = useState();
  const onHandleInputChange = (newFormData) => {
    console.log("Form data received from child:", newFormData);
    setFormData(newFormData);
  };
  console.log("FormData", formData);
  // Assuming you have 3 steps for the progress bar
  const progressValue = (step / 3) * 100;

  const onGoToNext = () => {
    console.log("Checking form data:", formData);
    console.log("Raw duration value:", formData?.duration);

    // More lenient duration check
    const hasDuration =
      formData?.duration && formData.duration.trim().length > 0;

    // Debug logging for each field
    console.log("Validation check results:", {
      jobPosition: !!formData?.jobPosition,
      jobDescription: !!formData?.jobDescription,
      duration: hasDuration,
      rawDuration: formData?.duration,
      interviewTypes: formData?.interviewTypes?.length > 0,
    });

    if (
      !formData?.jobPosition ||
      !formData?.jobDescription ||
      !hasDuration ||
      !formData?.interviewTypes?.length
    ) {
      const missingFields = [];
      if (!formData?.jobPosition) missingFields.push("Job Position");
      if (!formData?.jobDescription) missingFields.push("Job Description");
      if (!hasDuration) missingFields.push("Duration");
      if (!formData?.interviewTypes?.length)
        missingFields.push("Interview Types");

      console.log("Missing fields:", missingFields);
      toast(`Please Enter All Details! Missing: ${missingFields.join(", ")}`);
      return;
    }
    console.log("Moving to next step with form data:", formData);
    setStep(step + 1);
  };

  const onCreateLink = (interview_id) => {
    setInterviewId(interview_id);
    setStep(step + 1);
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-8 flex flex-col">
      {/* Header with Back Arrow, Title, Progress Bar */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-5 items-center w-full">
        <div className="flex items-center gap-4 md:gap-5">
          <ArrowLeft onClick={() => router.back()} className="cursor-pointer" />
          <h2 className="font-bold text-xl md:text-2xl">
            Create New Interview
          </h2>
        </div>
        <div className="w-full md:w-1/3">
          <Progress value={progressValue} />
        </div>
      </div>
      {/* Form Content */}
      {step == 1 ? (
        <FormContainer
          onHandleInputChange={onHandleInputChange}
          GoToNext={() => onGoToNext()}
        />
      ) : step == 2 ? (
        <QuestionList
          formData={formData}
          onCreateLink={(interview_id) => onCreateLink(interview_id)}
        />
      ) : step == 3 ? (
        <InterviewLink interview_id={interviewId} formData={formData} />
      ) : null}
    </div>
  );
}

export default CreateInterview;
