import React from "react";
import moment from "moment";
import { Button } from "../../../../components/ui/button.jsx";
import { Copy, Send, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

function InterviewCard({ interview, viewDetail = false }) {
  const url = process.env.NEXT_PUBLIC_HOST_URL + "/" + interview?.interview_id;

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    toast("Copied");
  };

  const onSend = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "AInterview Link",
          text: "Interview Link: " + url,
          url: url,
        })
        .catch((error) => {
          toast("Share cancelled or failed");
        });
    } else {
      // fallback to mailto
      window.location.href =
        "mailto:?subject=AInterview Interview Link&body=Interview Link: " + url;
    }
  };

  return (
    <div className="p-5 bg-white rounded-lg border">
      <div className="flex  items-center justify-between">
        <div className="h-[40px] w-[40px] bg-primary rounded-full"></div>
        <h2 className="text-sm">
          {moment(interview?.created_at).format("DD MMM YYY")}
        </h2>
      </div>
      <h2 className="mt-3 fond-bold text-lg">{interview?.jobPosition}</h2>
      <h2 className="mt-2 flex justify-between text-gray-500">
        {interview?.duration}
        <span className="text-green-700">
          {interview["interview-feedback"]?.length || 0} Candidates
        </span>
      </h2>

      {!viewDetail ? (
        <>
          <div className="flex gap-3 mt-5">
            <Button variant="outline" className={"w-full"} onClick={copyLink}>
              <Copy />
              Copy Link
            </Button>
          </div>
          <Button className={"w-full"} onClick={onSend}>
            <Send />
            Send
          </Button>
        </>
      ) : (
        <Link
          href={`/scheduled-interview/${interview?.interview_id}/details`}
          className="mt-5 w-full block"
        >
          <Button className="w-full" variant="outline">
            View Details
            <ArrowRight />
          </Button>
        </Link>
      )}
    </div>
  );
}

export default InterviewCard;
