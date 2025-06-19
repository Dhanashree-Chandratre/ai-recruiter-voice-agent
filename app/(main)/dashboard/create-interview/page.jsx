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
    console.log("Form data updated:", newFormData);
    setFormData(newFormData);
  };
  console.log("FormData", formData);
  // Assuming you have 3 steps for the progress bar
  const progressValue = (step / 3) * 100;

  const onGoToNext = () => {
    console.log("Checking form data:", formData);
    if (
      !formData?.jobPosition ||
      !formData?.jobDescription ||
      !formData?.duration ||
      !formData?.interviewTypes?.length
    ) {
      toast("Please Enter All Details!");
      return;
    }
    console.log("Moving to next step");
    setStep(step + 1);
  };

  const onCreateLink = (interview_id) => {
    setInterviewId(interview_id);
    setStep(step + 1);
  };

  return (
    <div className="mt-6 w-full flex flex-col gap-6">
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
