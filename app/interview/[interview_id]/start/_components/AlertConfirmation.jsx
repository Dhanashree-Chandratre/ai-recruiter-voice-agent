import React from "react";
import { useRouter, useParams } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";

function AlertConfirmation({ children, stopInterview }) {
  const router = useRouter();
  const params = useParams();

  const handleEndInterview = async () => {
    try {
      console.log("Ending interview...");
      await stopInterview();
      console.log("Interview ended successfully");

      // Clear the interview data from localStorage
      localStorage.removeItem("interviewData");
      localStorage.removeItem("userName");

      // Navigate back to the interview page
      router.push(`/interview/${params.interview_id}`);
    } catch (error) {
      console.error("Error ending interview:", error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will end the interview.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleEndInterview}
            className="!bg-red-600 hover:!bg-red-700 !text-white"
            title="End Interview"
          >
            End Interview
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AlertConfirmation;
