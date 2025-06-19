import React from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Input } from "../../../../../components/ui/input";
import { Button } from "../../../../../components/ui/button";
import {
  Copy,
  Clock,
  List,
  Mail,
  ArrowLeft,
  Plus,
  MessageSquare,
  Slack,
} from "lucide-react";

function InterviewLink({ interview_id, formData }) {
  const url = process.env.NEXT_PUBLIC_HOST_URL + "/" + interview_id;

  const GetInterviewUrl = () => {
    return url;
  };

  const onCopyLink = async () => {
    console.log("Copy button clicked");
    console.log("URL to copy:", url);
    try {
      await navigator.clipboard.writeText(url);
      console.log("URL copied successfully");
      toast.success("Link Copied!", {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#4CAF50",
          color: "white",
          fontSize: "14px",
          padding: "12px 24px",
        },
      });
    } catch (error) {
      console.error("Failed to copy link:", error);
      toast.error("Failed to copy link", {
        duration: 3000,
        position: "top-center",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <Image
        src="/check.png"
        alt="check"
        width={200}
        height={200}
        className="w-[50px] h-[50px]"
      />

      <h2 className="font-bold text-lg mt-4">Your AI Interview is Ready</h2>
      <p className="mt-3">
        Share this link with your candidates to start the interview process
      </p>
      <div className="w-full p-7 mt-6 rounded-lg bg-white">
        <div className="flex justify-between items-center">
          <h2 className="font-bold">Interview Link</h2>
          <h2 className="p-1 px-2 text-primary bg-blue-50 rounded">
            Valid for 30 days
          </h2>
        </div>
        <div className="mt-3 flex gap-3 items-center">
          <Input defaultValue={GetInterviewUrl()} disabled={true} />
          <Button onClick={onCopyLink} className="cursor-pointer">
            <Copy /> Copy Link
          </Button>
        </div>
        <hr className="my-5" />
        <div className="flex gap-5">
          <h2 className="text-sm text-gray-500 flex gap-2 items-center">
            <Clock className="h-4 w-4" />
            {formData?.duration}
          </h2>
          <h2 className="text-sm text-gray-500 flex gap-2 items-center">
            <List className="h-4 w-4" />
            {formData?.duration}
          </h2>
        </div>
      </div>
      <div className="mt-7 bg-white p-5 rounded-lg w-full">
        <h2 className="font-bold">Share Via</h2>
        <div className="flex gap-7 mt-2">
          <Button
            variant={"outline"}
            className="cursor-pointer"
            onClick={() => {
              window.open(
                `mailto:?subject=AI Interview Link&body=Here is your interview link: ${GetInterviewUrl()}`
              );
            }}
          >
            <Mail /> Email
          </Button>
          <Button
            variant={"outline"}
            className="cursor-pointer"
            onClick={() => {
              window.open(
                `https://wa.me/?text=Here%20is%20your%20AI%20interview%20link:%20${encodeURIComponent(
                  GetInterviewUrl()
                )}`
              );
            }}
          >
            <MessageSquare /> WhatsApp
          </Button>
          <Button
            variant={"outline"}
            className="cursor-pointer"
            onClick={onCopyLink}
          >
            <Slack /> Slack
          </Button>
        </div>
      </div>
      <div className="flex w-full gap-5 justify-between mt-6">
        <Link href={"/dashboard"}>
          <Button variant={"outline"} className="cursor-pointer">
            <ArrowLeft />
            Back to Dashboard
          </Button>
        </Link>
        <Link href={"/create-interview"}>
          <Button className="cursor-pointer">
            <Plus />
            Create New Interview
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default InterviewLink;
