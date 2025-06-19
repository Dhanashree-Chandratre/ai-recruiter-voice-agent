import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import QuestionListContainer from "./QuestionListContainer";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../../../../../services/supabaseClient";

function QuestionList({ formData, onCreateLink }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [questionList, setQuestionList] = useState();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get the current user
    const getUser = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session:", error);
        return;
      }
      if (session?.user) {
        setUser(session.user);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    if (formData) {
      GenerateQuestionList();
    }
  }, [formData]);

  const cleanJsonString = (str) => {
    // Find the JSON array in the response
    const jsonMatch = str.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (jsonMatch) {
      return jsonMatch[0];
    }
    return str;
  };

  const GenerateQuestionList = async () => {
    setLoading(true);
    try {
      console.log("Sending request with formData:", formData);
      const result = await axios.post("/api/ai-model", {
        ...formData,
      });
      console.log("Raw API Response:", result);

      const Content = result.data.questions;
      console.log("Content before parsing:", Content);

      try {
        // Extract and parse the JSON array
        const cleanedContent = cleanJsonString(Content);
        console.log("Cleaned content:", cleanedContent);

        const parsedContent = JSON.parse(cleanedContent);
        console.log("Successfully parsed questions array:", parsedContent);
        setQuestionList(parsedContent);
      } catch (parseError) {
        console.error("Failed to parse questions:", parseError);
        toast.error("Failed to parse questions. Please try again.");
      }

      setLoading(false);
    } catch (e) {
      console.log("Error in GenerateQuestionList:", e);
      console.log("Error details:", {
        message: e.message,
        response: e.response?.data,
        status: e.response?.status,
      });
      toast.error("Server Error, Try Again!");
      setLoading(false);
    }
  };

  const onFinish = async () => {
    setSaving(true);
    let interview_id = null;
    try {
      // Validate user
      if (!user?.email) {
        console.error("User validation failed:", { user });
        toast.error("User email not found. Please sign in again.");
        setSaving(false);
        return;
      }

      // Validate data
      if (!formData || !questionList) {
        console.error("Data validation failed:", { formData, questionList });
        toast.error("Missing required data. Please try again.");
        setSaving(false);
        return;
      }

      // Generate unique ID
      interview_id = uuidv4();

      // Prepare data for Supabase
      const interviewData = {
        jobPosition: formData.jobPosition,
        jobDescription: formData.jobDescription,
        duration: formData.duration,
        type: formData.interviewTypes?.join(", "), // Convert array to string
        questionList: JSON.stringify(questionList), // Convert array to JSON string
        userEmail: user.email,
        interview_id: interview_id,
        created_at: new Date().toISOString(),
      };

      console.log(
        "Preparing to save interview with data:",
        JSON.stringify(interviewData, null, 2)
      );

      // Insert data
      console.log("Attempting to insert data into Supabase...");
      const { data, error } = await supabase
        .from("interviews")
        .insert([interviewData])
        .select();

      if (error) {
        console.error("Error saving interview:", error);
        console.error("Error details:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          data: interviewData,
        });
        toast.error(`Failed to save interview: ${error.message}`);
        setSaving(false);
        return;
      }

      console.log("Successfully saved interview:", data);
      toast.success("Interview saved successfully");
    } catch (error) {
      console.error("Error in onFinish:", error);
      console.error("Full error object:", error);
      toast.error(`An unexpected error occurred: ${error.message}`);
    } finally {
      setSaving(false);
      if (interview_id) {
        onCreateLink(interview_id);
      }
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="p-5 bg-secondary w-full flex-1 rounded-xl border border-primary flex flex-col gap-5">
        {loading && (
          <div className="flex gap-2 items-center">
            <Loader2Icon className="animate-spin" />
            <div>
              <h2 className="font-medium">Generating Interview Questions</h2>
              <p className="text-primary">
                Our AI is crafting personalized questions based on your Job
                Description
              </p>
            </div>
          </div>
        )}

        {questionList?.length > 0 && (
          <div>
            <QuestionListContainer questionList={questionList} />
          </div>
        )}
      </div>

      <div className="flex justify-end mt-10">
        <Button onClick={onFinish} disabled={saving || loading}>
          {saving ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Create Interview Link and Finish"
          )}
        </Button>
      </div>
    </div>
  );
}

export default QuestionList;
