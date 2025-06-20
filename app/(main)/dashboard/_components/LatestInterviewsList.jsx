"use client";
import React, { useEffect, useState } from "react";
import { Video } from "lucide-react";
import { Button } from "../../../../components/ui/button.jsx";
import { supabase } from "../../../../services/supabaseClient";
import { useUser } from "../../provider.js";
import InterviewCard from "./InterviewCard";

function LatestInterviewsList() {
  const [interviewList, setInterviewList] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    user && GetInterviewList();
  }, [user]);
  const GetInterviewList = async () => {
    let { data: interviews, error } = await supabase
      .from("interviews")
      .select("*, interview-feedback(*)")
      .eq("userEmail", user?.email)
      .order("id", { ascending: false })
      .limit(6);

    console.log(interviews);
    setInterviewList(interviews);
  };

  return (
    <div className="my-5 w-full">
      <h2 className="mt-12 text-xl md:text-2xl font-bold mb-4 md:mb-5">
        Previously Created Interviews
      </h2>
      {interviewList?.length == 0 && (
        <div className="p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center gap-3 md:gap-4 bg-white rounded-2xl shadow-sm w-full">
          <Video className="w-10 h-10 md:w-12 md:h-12 text-primary" />
          <h2 className="text-gray-500 text-base md:text-lg">
            No Interviews Created Yet
          </h2>
          <Button className="mt-2 w-full sm:w-auto">
            + Create New Interview
          </Button>
        </div>
      )}
      {interviewList && (
        <div className="grid grid-cols-2 mt-5 xl:grid-cols-3 gap-5">
          {interviewList.map((interview, index) => (
            <InterviewCard interview={interview} key={index} />
          ))}
        </div>
      )}
    </div>
  );
}

export default LatestInterviewsList;
