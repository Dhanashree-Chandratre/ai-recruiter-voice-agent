"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Clock, Info, Video, Loader2Icon } from "lucide-react";
import { Input } from "../../../components/ui/input.jsx";
import { Button } from "../../../components/ui/button.jsx";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../services/supabaseClient.js";
import { toast } from "sonner";
import { useInterviewData } from "../../../context/InterviewDataContext.jsx";

function Interview() {
  const params = useParams();
  const interviewId = params?.interview_id;
  const [interviewDetails, setInterviewDetails] = useState(null);
  const [userEmail, setUserEmail] = useState();
  const [loading, setLoading] = useState(false);
  const { interviewData, setInterviewData, userName, setUserName } =
    useInterviewData();
  console.log("Interview ID:", interviewId);
  const router = useRouter();

  useEffect(() => {
    if (interviewId) {
      getInterviewDetails();
    }
  }, [interviewId]);

  const getInterviewDetails = async () => {
    setLoading(true);
    try {
      console.log("Attempting to fetch interview with ID:", interviewId);

      if (!interviewId) {
        console.error("No interview ID provided");
        toast.error("Invalid Interview Link", {
          duration: 4000,
          position: "top-center",
        });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("interviews")
        .select("*")
        .eq("interview_id", interviewId)
        .maybeSingle();

      console.log("Supabase response:", { data, error });

      if (error) {
        console.error("Supabase error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        toast.error("Invalid Interview Link", {
          duration: 4000,
          position: "top-center",
        });
        setLoading(false);
        return;
      }

      if (!data) {
        console.log("No data found for interview ID:", interviewId);
        toast.error("Invalid Interview Link", {
          duration: 4000,
          position: "top-center",
        });
        setLoading(false);
        return;
      }

      setInterviewDetails(data);
      setLoading(false);
      console.log("Successfully fetched interview details:", data);
    } catch (error) {
      console.error("Error in getInterviewDetails:", error);
      toast.error("Invalid Interview Link", {
        duration: 4000,
        position: "top-center",
      });
      setLoading(false);
    }
  };

  const onJoinInterview = async () => {
    setLoading(true);
    try {
      let { data: interviews, error } = await supabase
        .from("interviews")
        .select("*")
        .eq("interview_id", interviewId);

      if (error) {
        toast.error("Error joining interview");
        setLoading(false);
        return;
      }

      if (!interviews || interviews.length === 0) {
        toast.error("Interview not found");
        setLoading(false);
        return;
      }

      const interviewData = {
        ...interviews[0],
        userName: userName,
        userEmail: userEmail,
      };

      console.log("Setting interview data:", interviewData);

      // Set data in sessionStorage first
      sessionStorage.setItem("interviewData", JSON.stringify(interviewData));
      sessionStorage.setItem("userName", userName);

      // Then update context
      setInterviewData(interviewData);
      setUserName(userName);

      // Encode the interview data for URL
      // const encodedData = encodeURIComponent(JSON.stringify(interviewData));
      // const targetPath = `/interview/${interviewId}/start?data=${encodedData}`;
      const targetPath = `/interview/${interviewId}/start`;
      console.log("Navigating to:", targetPath);
      router.push(targetPath);
    } catch (error) {
      console.error("Error in onJoinInterview:", error);
      toast.error("Error joining interview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-10 md:px-28 lg:px-48 xl:px-64 mt-16">
      <div className="flex flex-col items-center justify-center border rounded-lg bg-white p-7 lg:px-33 xl:px-52 mb-20">
        <Image
          src="/logo.png"
          alt="logo"
          width={350}
          height={350}
          className="w-[140px]"
        />
        <h2 className="mt-3 font-medium">AI-Powered Interview Platform</h2>
        <Image
          src="/interview.png"
          alt="interview"
          width={500}
          height={500}
          className="w-[300px] my-6"
        />
        <h2 className="font-bold text-xl">{interviewDetails?.jobPosition}</h2>
        <h2 className="flex gap-2 items-center text-gray-500 mt-3">
          <Clock className="h-4 w-4" /> {interviewDetails?.duration}
        </h2>
        <div className="w-full">
          <h2 className="font-medium">Enter your Full Name</h2>
          <Input
            placeholder="e.g. John Smith"
            onChange={(event) => setUserName(event.target.value)}
          />
        </div>
        <div className="w-full">
          <h2 className="font-medium">Enter your Email</h2>
          <Input
            placeholder="e.g. john@gmail.com"
            onChange={(event) => setUserEmail(event.target.value)}
          />
        </div>

        <div className="p-3 bg-blue-100 flex gap-4 rounded-lg mt-4">
          <Info className="text-primary" />
          <div>
            <h2 className="font-bold">Before you begin</h2>
            <ul>
              <li className="text-sm text-primary">
                - Ensure you have a stable internet connection
              </li>
              <li className="text-sm text-primary">
                - Test your camera and microphone
              </li>
              <li className="text-sm text-primary">
                - Find a quiet place for the interview
              </li>
            </ul>
          </div>
        </div>
        <Button
          className="mt-5 w-full font-bold"
          disabled={loading || !userName}
          onClick={onJoinInterview}
        >
          <Video />
          {loading && <Loader2Icon className="animate-spin" />}
          Join Interview
        </Button>
      </div>
    </div>
  );
}

export default Interview;
