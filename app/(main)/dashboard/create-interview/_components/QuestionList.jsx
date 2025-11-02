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
    if (!str || typeof str !== "string") {
      console.error("Invalid input to cleanJsonString:", str);
      return "[]";
    }

    // Remove markdown code blocks if present (```json ... ``` or ``` ... ```)
    let cleaned = str
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim();

    // Try to find JSON array in various formats
    // Pattern 1: Direct JSON array
    let jsonMatch = cleaned.match(/\[\s*\{[\s\S]*\}\s*\]/);

    if (!jsonMatch) {
      // Pattern 2: JSON array with potential extra whitespace/newlines
      jsonMatch = cleaned.match(/\[[\s\S]*?\]/);
    }

    if (!jsonMatch) {
      // Pattern 3: Look for array starting after common prefixes
      const arrayStart = cleaned.indexOf("[");
      const arrayEnd = cleaned.lastIndexOf("]");
      if (arrayStart !== -1 && arrayEnd !== -1 && arrayEnd > arrayStart) {
        jsonMatch = [cleaned.substring(arrayStart, arrayEnd + 1)];
      }
    }

    if (jsonMatch && jsonMatch[0]) {
      return jsonMatch[0].trim();
    }

    console.warn("Could not extract JSON array from response:", str);
    return str.trim();
  };

  const GenerateQuestionList = async () => {
    setLoading(true);
    try {
      console.log("Sending request with formData:", formData);

      // Convert interviewTypes array to comma-separated string for the API
      const requestData = {
        jobPosition: formData.jobPosition,
        jobDescription: formData.jobDescription,
        duration: formData.duration,
        type: Array.isArray(formData.interviewTypes)
          ? formData.interviewTypes.join(", ")
          : formData.interviewTypes || "Technical",
      };

      console.log("Request data being sent:", requestData);

      const result = await axios.post("/api/ai-model", requestData);
      console.log("Raw API Response:", result);

      // Check if API returned an error
      if (result.data.error) {
        throw new Error(result.data.error);
      }

      const Content = result.data.questions;

      if (!Content) {
        throw new Error("No questions received from API");
      }

      console.log("Content before parsing:", Content);

      try {
        // Extract and parse the JSON array
        const cleanedContent = cleanJsonString(Content);
        console.log("Cleaned content:", cleanedContent);
        console.log("Cleaned content length:", cleanedContent.length);

        const parsedContent = JSON.parse(cleanedContent);

        // Validate parsed content is an array
        if (!Array.isArray(parsedContent)) {
          throw new Error("Parsed content is not an array");
        }

        // Validate array has valid question objects
        const validQuestions = parsedContent.filter(
          (q) => q && typeof q === "object" && q.question && q.type
        );

        if (validQuestions.length === 0) {
          throw new Error("No valid questions found in parsed array");
        }

        console.log("Successfully parsed questions array:", validQuestions);
        setQuestionList(validQuestions);
      } catch (parseError) {
        console.error("Failed to parse questions:", parseError);
        console.error("Parse error details:", {
          message: parseError.message,
          stack: parseError.stack,
          rawContent: Content,
          contentLength: Content?.length,
          contentPreview: Content?.substring(0, 500),
        });
        toast.error(
          `Failed to parse questions: ${parseError.message}. Please check the console for details.`
        );
      }

      setLoading(false);
    } catch (e) {
      console.error("Error in GenerateQuestionList:", e);
      console.error("Error details:", {
        message: e.message,
        response: e.response?.data,
        status: e.response?.status,
        code: e.code,
        stack: e.stack,
      });

      // Provide more specific error messages
      let errorMessage = "Server Error, Try Again!";

      if (e.response) {
        // API returned an error response
        const apiError =
          e.response.data?.error || e.response.data?.message || e.message;
        errorMessage = `API Error: ${apiError}`;
      } else if (e.request) {
        // Request was made but no response received
        errorMessage =
          "Network Error: Unable to reach the server. Please check your connection.";
      } else if (e.message) {
        // Something else happened
        errorMessage = `Error: ${e.message}`;
      }

      toast.error(errorMessage);
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
