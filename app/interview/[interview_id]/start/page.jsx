"use client";
import React, { useContext, useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Timer, Clock, Mic, VideoOff, Phone, Plus, MicOff } from "lucide-react";
import Vapi from "@vapi-ai/web";
import AlertConfirmation from "./_components/AlertConfirmation";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { Button } from "../../../../components/ui/button";
import { toast } from "sonner";
import { InterviewDataContext } from "../../../../context/InterviewDataContext.jsx";
import axios from "axios"; // Import axios
// No need to import InterviewDataProvider here, it's used in the layout
// import { InterviewDataProvider } from "../../../../context/InterviewDataContext.jsx";

function StartInterview() {
  const { interviewData, setInterviewData, userName, setUserName } =
    useContext(InterviewDataContext);
  const searchParams = useSearchParams();
  const [vapi, setVapi] = useState(null); // Correctly manage Vapi instance as state
  const [activeUser, setActiveUser] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isMicOn, setIsMicOn] = useState(true);
  const [conversation, setConversation] = useState([]);
  const callStartedRef = useRef(false); // Add a ref to track if the call has started
  const [isCallActive, setIsCallActive] = useState(false); // New state to track actual call active status
  const { interview_id } = useParams(); // Correctly destructure interview_id as an object
  const router = useRouter();

  // Vapi instance initialization and all event listeners consolidated
  useEffect(() => {
    if (typeof window !== "undefined" && !vapi) {
      const newVapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);
      setVapi(newVapi);
      console.log(
        "VAPI Instance Created. Public Key:",
        process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY
      );

      // All event listeners for Vapi
      newVapi.on("call-start", () => {
        console.log("Call started");
        setIsCallActive(true); // Set call active on start
      });
      newVapi.on("call-end", () => {
        console.log("Call ended");
        toast("Interview Ended");
        // Pretty print the conversation after call end
        console.log(
          "Full conversation after call end:\n",
          JSON.stringify(conversation, null, 2)
        );
        GenertaeFeedback();
        setIsCallActive(false);
        callStartedRef.current = false;
        router.back();
      });
      newVapi.on("speech-start", () => {
        console.log("Assistant speech has started.");
        setActiveUser(false);
      });
      newVapi.on("speech-end", () => {
        console.log("Assistant speech has ended.");
        setActiveUser(true);
      });
      newVapi.on("message", (message) => {
        console.log("New message:", message);
        setConversation((prev) => [...prev, message]);
      });
      newVapi.on("error", (error) => {
        console.error(
          "Vapi error (full object):",
          error,
          JSON.stringify(error)
        );
        const errorMessage =
          error?.message || "An unknown Vapi error occurred.";
        toast.error("Vapi Error: " + errorMessage);
        setIsCallActive(false);
      });
      newVapi.on("conversation-update", (event) => {
        setConversation(event.conversation);
        sessionStorage.setItem(
          "interviewConversation",
          JSON.stringify(event.conversation)
        );
        console.log("Conversation Updated:", event.conversation);
      });

      // Cleanup function for Vapi
      return () => {
        console.log("Cleaning up Vapi instance");
        if (newVapi) {
          newVapi.stop();
        }
        setVapi(null); // Explicitly reset vapi state to null on cleanup
      };
    }
  }, []); // Empty dependency array means this runs only once on mount

  useEffect(() => {
    console.log("StartInterview component mounted");
    if (typeof window !== "undefined") {
      const savedData = sessionStorage.getItem("interviewData");
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          console.log("Using sessionStorage data:", parsedData);
          setInterviewData(parsedData);
          setUserName(parsedData.userName);
          if (parsedData.duration) {
            const durationInMinutes = parseInt(
              parsedData.duration.split(" ")[0]
            );
            setRemainingTime(durationInMinutes * 60); // Convert to seconds
          }
        } catch (error) {
          console.error("Error parsing sessionStorage data:", error);
        }
      }
    }
  }, [setInterviewData, setUserName]);

  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            if (vapi) {
              console.log("Interview time ended. Stopping VAPI.");
              vapi.stop();
            }
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [remainingTime, vapi]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      seconds.toString().padStart(2, "0"),
    ].join(":");
  };

  const extendInterview = (additionalMinutes) => {
    setRemainingTime((prevTime) => prevTime + additionalMinutes * 60);
    console.log(`Interview extended by ${additionalMinutes} minutes.`);

    if (vapi && vapi.assistant && vapi.assistant.model) {
      const updatedAssistantOptions = {
        ...vapi.assistant,
        model: {
          ...vapi.assistant.model,
          messages: [
            {
              role: "system",
              content: `
  You are an AI voice assistant conducting interviews.
  Your job is to ask candidates provided interview questions, assess their responses.
  The interview is now set for ${formatTime(
    remainingTime + additionalMinutes * 60
  )} minutes.
  Begin the conversation with a friendly introduction, setting a relaxed yet professional tone. Example:
  "Hey there! Welcome to your ${
    interviewData?.jobPosition
  } interview. Let's get started with a few questions!"
  Ask one question at a time and wait for the candidate's response before proceeding. Keep the questions clear and concise. Below Are the questions ask one by one:
  Questions: ${questionList}
  If the candidate struggles, offer hints or rephrase the question without giving away the answer. Example:
  "Need a hint? Think about how React tracks component updates!"
  Provide brief, encouraging feedback after each answer. Example:
  "Nice! That's a solid answer."
  "Hmm, not quite! Want to try again?"
  Keep the conversation natural and engaging—use casual phrases like "Alright, next up..." or "Let's tackle a tricky one!"
  After 5-7 questions, wrap up the interview smoothly by summarizing their performance. Example:
  "That was great! You handled some tough questions well. Keep sharpening your skills!"
  End on a positive note:
  "Thanks for chatting! Hope to see you crushing projects soon!"
  Key Guidelines:
  ✅ Be friendly, engaging, and witty 🎤
  ✅ Keep responses short and natural, like a real conversation
  ✅ Adapt based on the candidate's confidence level
  ✅ Ensure the interview remains focused on React
  `.trim(),
            },
          ],
        },
      };
      vapi.update(updatedAssistantOptions);
    } else {
      console.warn("Vapi assistant or model is not available yet.");
      toast.error("Cannot extend interview: Assistant not ready.");
    }
  };

  const startCall = () => {
    if (!vapi) {
      console.error("Vapi instance not available");
      toast.error("Vapi instance not available");
      return;
    }
    if (!interviewData || !interviewData.questionList) {
      console.error("Interview data or question list not available");
      toast.error("Interview data or question list not available");
      return;
    }

    let questionList = "";
    console.log(
      "Starting call with question list:",
      interviewData?.questionList
    );

    // Handle both array and string formats
    if (interviewData?.questionList) {
      const questions = Array.isArray(interviewData.questionList)
        ? interviewData.questionList
        : [interviewData.questionList];

      questions.forEach((item) => {
        if (typeof item === "string") {
          questionList = questionList ? questionList + "," + item : item;
        } else if (item?.question) {
          questionList = questionList
            ? questionList + "," + item.question
            : item.question;
        }
      });
    }

    console.log("Processed question list for VAPI:", questionList);

    const assistantOptions = {
      name: "AI Recruiter",
      firstMessage:
        "Hi " +
        (interviewData?.userName || "") +
        ", how are you? Ready for your interview on " +
        (interviewData?.jobPosition || "") +
        "?",
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },
      voice: {
        provider: "playht",
        voiceId: "jennifer",
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `
  You are an AI voice assistant conducting interviews.
  Your job is to ask candidates provided interview questions, assess their responses.
  The interview is set for ${formatTime(remainingTime)} minutes.
  Begin the conversation with a friendly introduction, setting a relaxed yet professional tone. Example:
  "Hey there! Welcome to your ${
    interviewData?.jobPosition
  } interview. Let's get started with a few questions!"
  Ask one question at a time and wait for the candidate's response before proceeding. Keep the questions clear and concise. Below Are the questions ask one by one:
  Questions: ${questionList}
  If the candidate struggles, offer hints or rephrase the question without giving away the answer. Example:
  "Need a hint? Think about how React tracks component updates!"
  Provide brief, encouraging feedback after each answer. Example:
  "Nice! That's a solid answer."
  "Hmm, not quite! Want to try again?"
  Keep the conversation natural and engaging—use casual phrases like "Alright, next up..." or "Let's tackle a tricky one!"
  After 5-7 questions, wrap up the interview smoothly by summarizing their performance. Example:
  "That was great! You handled some tough questions well. Keep sharpening your skills!"
  End on a positive note:
  "Thanks for chatting! Hope to see you crushing projects soon!"
  Key Guidelines:
  ✅ Be friendly, engaging, and witty 🎤
  ✅ Keep responses short and natural, like a real conversation
  ✅ Adapt based on the candidate's confidence level
  ✅ Ensure the interview remains focused on React
  `.trim(),
          },
        ],
      },
    };

    console.log("Attempting to start VAPI with options:", assistantOptions);
    vapi
      .start(assistantOptions)
      .then(() => {
        console.log("VAPI started successfully");
        toast.success("Call started successfully");
        callStartedRef.current = true; // Set ref to true on successful start
      })
      .catch((error) => {
        console.error("Error starting VAPI call:", error);
        toast.error("Failed to start call: " + error.message);
      });
  };

  const toggleMic = () => {
    if (vapi && isCallActive) {
      // Use the new isCallActive state
      vapi.setMuted(isMicOn);
      setIsMicOn(!isMicOn);
      console.log(`Microphone turned ${isMicOn ? "off" : "on"}.`);
    } else {
      console.log(
        "Call is not available yet. Please wait for the call to initialize."
      );
      toast("Please wait for the call to initialize");
    }
  };

  const GenertaeFeedback = async () => {
    try {
      const result = await axios.post("/api/ai-feedback", {
        converstaion: conversation,
      });
      const feedbackContainer = result?.data?.feedback;
      console.log("Raw feedbackContainer:", feedbackContainer);

      if (feedbackContainer && typeof feedbackContainer === "object") {
        // Pretty print the feedback JSON
        console.log(
          "Interview Feedback:\n",
          JSON.stringify(feedbackContainer, null, 2)
        );
        toast.success("Feedback generated successfully!");

        // Prepare data for Supabase
        const recommended = feedbackContainer.Recommendation === "Yes";
        // Fallback: if interviewData is null, try to load from sessionStorage
        let data = interviewData;
        if (!data) {
          const stored = sessionStorage.getItem("interviewData");
          if (stored) data = JSON.parse(stored);
        }
        const feedbackUserName = data?.userName || userName;
        const jobPosition = data?.jobPosition;
        const userEmail = data?.userEmail;
        try {
          await axios.post("/api/save-feedback", {
            userName: feedbackUserName,
            userEmail,
            interview_id,
            feedback: feedbackContainer,
            recommended,
          });
          // Save feedback to sessionStorage for completed page
          sessionStorage.setItem(
            "latestFeedback",
            JSON.stringify({
              userName: feedbackUserName,
              jobPosition,
              feedback: feedbackContainer,
            })
          );
          router.push(`/interview/${interview_id}/completed`);
        } catch (e) {
          console.error("Failed to save feedback to Supabase:", e);
        }
      } else {
        console.error(
          "Feedback content is not an object, cannot process. Actual value:",
          feedbackContainer
        );
        toast.error(
          "Failed to generate feedback: Invalid feedback content type."
        );
        return;
      }
    } catch (error) {
      console.error("Error generating feedback:", error);
      toast.error("Failed to generate feedback: " + error.message);
    }
  };

  const handleStartInterview = () => {
    callStartedRef.current = false; // Reset before starting
    startCall();
  };

  // Unified Vapi start trigger
  useEffect(() => {
    console.log(
      "Checking conditions to start call: Vapi ready = ",
      !!vapi,
      " InterviewData ready = ",
      !!interviewData,
      "Remaining Time > 0 = ",
      remainingTime > 0,
      " Call already started = ",
      callStartedRef.current
    );
    if (
      vapi &&
      interviewData &&
      interviewData.questionList &&
      remainingTime > 0 &&
      !callStartedRef.current
    ) {
      console.log("Conditions met. Starting call.");
      startCall();
    } else if (callStartedRef.current) {
      console.log("Call already initiated. Skipping restart.");
    } else if (!vapi) {
      console.log("Vapi instance not yet available.");
    } else if (!interviewData) {
      console.log("Interview data not yet loaded.");
    } else if (!interviewData.questionList) {
      console.log("Question list not available in interview data.");
    } else if (remainingTime <= 0) {
      console.log(
        "Interview time is zero or less. Not starting call automatically."
      );
    }
  }, [vapi, interviewData, remainingTime]);

  console.log("interviewData:", interviewData);
  console.log("interviewData.questionList:", interviewData?.questionList);

  return (
    <div className="p-20 lg:px-48 xl:px-56">
      {/* Header */}
      <h2 className="font-bold text-xl flex justify-between">
        AI Interview Session
        <span className="flex gap-2 items-center">
          <Timer />
          {formatTime(remainingTime)}
        </span>
      </h2>

      {/* Avatars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-5">
        {/* AI Recruiter */}
        <div className="bg-white p-40 rounded-lg border flex flex-col gap-3 items-center justify-center">
          <Image
            src="/ai.png"
            alt="AI Recruiter"
            width={100}
            height={100}
            className="w-[100px] h-[100px] rounded-full object-cover"
          />
          <h2>AI Recruiter</h2>
        </div>

        {/* User */}
        <div className="bg-white p-40 rounded-lg border flex flex-col gap-3 items-center justify-center">
          <div className="w-[100px] h-[100px] bg-blue-500 text-white flex items-center justify-center text-3xl rounded-full">
            {userName ? userName.charAt(0) : "Y"}
          </div>
          <h2>{userName || "You"}</h2>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-5 justify-center mt-7">
        {isMicOn ? (
          <Mic
            className="h-12 w-12 p-3 rounded-full cursor-pointer bg-blue-500 text-white"
            onClick={toggleMic}
          />
        ) : (
          <MicOff
            className="h-12 w-12 p-3 rounded-full cursor-pointer bg-red-600 text-white"
            onClick={toggleMic}
          />
        )}
        <AlertConfirmation stopInterview={() => vapi.stop()}>
          <Phone className="h-12 w-12 p-3 bg-gray-500 text-white rounded-full cursor-pointer" />
        </AlertConfirmation>
        <Button
          onClick={() => extendInterview(10)} // Extend by 10 minutes
          className="h-12 w-12 p-3 bg-blue-500 text-white rounded-full cursor-pointer"
          title="Extend Time"
        >
          <Plus />
        </Button>
      </div>

      {/* Footer Note */}
      <h2 className="text-sm text-gray-400 text-center mt-5">
        Interview In Progress...
      </h2>
    </div>
  );
}

export default StartInterview;
