import React from "react";
import Image from "next/image";

function InterviewHeader() {
  return (
    <div className="p-4 shadow-sm">
      <Image
        src="/logo.png"
        alt="logo"
        width={200}
        height={200}
        className="w-[180px]"
      />
    </div>
  );
}

export default InterviewHeader;
