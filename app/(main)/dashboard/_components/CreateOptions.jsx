import React from "react";
import { Phone, Video } from "lucide-react";
import Link from "next/link";

function CreateOptions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full">
      <Link
        href={"/dashboard/create-interview"}
        className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 md:p-6 flex flex-col gap-2 cursor-pointer w-full"
      >
        <Video className="p-3 text-primary bg-blue-50 rounded-lg h-12 w-12" />
        <h2 className="font-bold text-base md:text-lg">Create New Interview</h2>
        <p className="text-gray-500 text-sm md:text-base">
          Create AI Interviews and Schedule them with Candidates
        </p>
      </Link>
      <Link
        href={"/dashboard/create-interview"}
        className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 md:p-6 flex flex-col gap-2 w-full cursor-pointer"
      >
        <Phone className="p-3 text-primary bg-blue-50 rounded-lg h-12 w-12" />
        <h2 className="font-bold text-base md:text-lg">
          Create Phone Screening Call
        </h2>
        <p className="text-gray-500 text-sm md:text-base">
          Schedule Phone Screening Call with Candidates
        </p>
      </Link>
    </div>
  );
}

export default CreateOptions;
