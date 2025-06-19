import React, { useState, useEffect } from "react";
import { Input } from "../../../../../components/ui/input";
import { Textarea } from "../../../../../components/ui/textarea.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select.jsx";
// Import necessary components
import { Button } from "../../../../../components/ui/button.jsx";
import { ArrowRight } from "lucide-react";

// Import InterviewType from Constants.jsx
import { InterviewType } from "../../../../../services/Constants.jsx";

function FormContainer({ onHandleInputChange, GoToNext }) {
  const [selectedInterviewTypes, setSelectedInterviewTypes] = useState([]);

  const [formData, setFormData] = useState({
    jobPosition: "",
    jobDescription: "",
    duration: "",
    interviewTypes: [],
  });

  useEffect(() => {
    onHandleInputChange(formData);
  }, [formData, onHandleInputChange]);

  const handleInputChange = (field, value) => {
    console.log(`Handling input change for field: ${field} with value:`, value); // Enhanced debug log
    console.log("Previous form data:", formData); // Log previous state
    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      };
      console.log("New form data:", newData); // Log new state
      return newData;
    });
  };

  useEffect(() => {
    console.log("FormContainer formData updated:", formData); // New debug log
  }, [formData]);

  const handleInterviewTypeClick = (typeTitle) => {
    console.log("Handling interview type click:", typeTitle); // Add logging
    console.log("Current selected types:", selectedInterviewTypes); // Log current state
    setSelectedInterviewTypes((prev) => {
      let updatedTypes;
      if (prev.includes(typeTitle)) {
        updatedTypes = prev.filter((itemTitle) => itemTitle !== typeTitle);
      } else {
        updatedTypes = [...prev, typeTitle];
      }
      console.log("Updated interview types:", updatedTypes); // Log updated state
      handleInputChange("interviewTypes", updatedTypes);
      return updatedTypes;
    });
  };

  const handleGenerateQuestions = () => {
    console.log("Current form data:", formData); // Debug log
    GoToNext();
  };

  return (
    <div className="p-5 bg-white w-full flex-1 rounded-xl">
      <div>
        <h2 className="text-sm font-medium">Job Position</h2>
        <Input
          placeholder="e.g. Full Stack Developer"
          className="mt-3"
          onChange={(event) =>
            handleInputChange("jobPosition", event.target.value)
          }
        />
      </div>
      <div className="mt-5">
        <h2 className="text-sm font-medium">Job Description</h2>
        <Textarea
          placeholder="Enter the details of Job description"
          className="h-[200px] mt-3"
          onChange={(event) =>
            handleInputChange("jobDescription", event.target.value)
          }
        />
      </div>
      <div className="mt-5">
        <h2 className="text-sm font-medium">Interview Duration</h2>
        <Select
          className="mt-3"
          value={formData.duration}
          onValueChange={(value) => {
            handleInputChange("duration", value);
          }}
        >
          <SelectTrigger className="w-full mt-2">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5 Mins">5 Mins</SelectItem>
            <SelectItem value="15 Mins">15 Mins</SelectItem>
            <SelectItem value="30 Mins">30 Mins</SelectItem>
            <SelectItem value="45 Mins">45 Mins</SelectItem>
            <SelectItem value="60 Mins">60 Mins</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Interview Type Section */}
      <div className="mt-5">
        <h2 className="text-sm font-medium">Interview Type</h2>
        <div className="flex gap-5 mt-3 flex-wrap">
          {InterviewType.map((type, index) => (
            <div
              key={index}
              className={`flex items-center cursor-pointer gap-2 p-1 px-4 bg-white border-gray-300 border rounded-2xl hover:bg-secondary
                  ${
                    selectedInterviewTypes.includes(type.title) &&
                    "bg-blue-100 text-primary"
                  }
                `}
              onClick={() => handleInterviewTypeClick(type.title)}
            >
              {/* Ensure type.icon is a valid React component */}
              {type.icon && <type.icon className="w-6 h-6" />}
              <span>{type.title}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-7 flex justify-end">
        <Button onClick={handleGenerateQuestions}>
          Generate Questions <ArrowRight />
        </Button>
      </div>
    </div>
  );
}

export default FormContainer;
