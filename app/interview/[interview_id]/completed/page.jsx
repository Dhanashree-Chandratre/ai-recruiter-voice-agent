"use client";
import Image from "next/image";
import { CheckCircle, Send } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../../components/ui/button.jsx";

export default function CompletedPage() {
  // ...fetching logic...

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      {/* Green checkmark */}
      <div className="flex flex-col items-center w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-10">
        <CheckCircle className="text-green-500 w-16 h-16 mb-2" />
        <h1 className="text-3xl font-bold mb-2 text-center">
          Interview Complete!
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Thank you for participating in the AI-driven interview with AIcruiter
        </p>
        {/* Illustration */}
        <div className="w-full flex justify-center mb-8">
          <Image
            src="/interview_completed.png"
            alt="Interview illustration"
            width={400}
            height={200}
            className="rounded-xl w-auto h-[220px] object-contain"
            priority
          />
        </div>
        {/* What's Next */}
        <div className="w-full flex flex-col items-center bg-gray-50 rounded-xl p-6 shadow-inner">
          <Send className="text-blue-500 w-10 h-10 mb-2" />
          <h2 className="text-xl font-semibold mb-2">What's Next?</h2>
          <p className="text-gray-600 text-center mb-2">
            The recruiter will review your interview responses and will contact
            you soon regarding the next steps.
          </p>
          <p className="text-gray-400 text-sm flex items-center gap-1">
            <span>⏱</span> Response within 2-3 business days
          </p>
        </div>
        {/* Back to Dashboard Button */}
        <Link href="/dashboard" className="mt-8 w-full">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
