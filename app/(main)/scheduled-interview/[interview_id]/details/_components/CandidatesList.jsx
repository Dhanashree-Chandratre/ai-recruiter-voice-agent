import moment from "moment";
import React from "react";
import { Button } from "../../../../../../components/ui/button.jsx";
import CandidateFeedbackDialog from "./CandidateFeedbackDialog";

function CandidatesList({ candidatesList }) {
  const safeList = Array.isArray(candidatesList) ? candidatesList : [];
  return (
    <div className="">
      <h2 className="font-bold my-5">Candidates({safeList.length})</h2>
      {safeList.map((candidate, index) => (
        <div
          key={index}
          className="p-5 flex gap-3 items-center justify-between bg-white rounded-lg"
        >
          <div className="flex items-center gap-5">
            <h2 className="bg-primary p-3 px-4.5 font-bold text-white rounded-full">
              {candidate.userName[0]}
            </h2>
            <div>
              <h2 className="font-bold">{candidate?.userName}</h2>
              <h2 className="text-sm text-gray-500">
                Completed On{" "}
                {moment(candidate?.created_at).format("MMM DD, yyyy")}
              </h2>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <h2 className="text-green-600">
              {(() => {
                const rating = candidate?.feedback?.feedback?.rating;
                if (rating) {
                  const values = [
                    rating.technicalSkills,
                    rating.communication,
                    rating.problemSolving,
                    rating.experience,
                  ]
                    .map(Number)
                    .filter((v) => !isNaN(v));
                  if (values.length) {
                    const avg =
                      values.reduce((a, b) => a + b, 0) / values.length;
                    return `${avg.toFixed(1)}/10`;
                  }
                }
                return "N/A";
              })()}
            </h2>
            <CandidateFeedbackDialog candidate={candidate} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default CandidatesList;
