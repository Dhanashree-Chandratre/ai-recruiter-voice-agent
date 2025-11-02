import {
  LayoutDashboard,
  Calendar,
  List,
  WalletCards,
  Settings,
  Code2Icon,
  User2Icon,
  BriefcaseBusinessIcon,
  Puzzle,
  Users,
} from "lucide-react";

export const SideBarOptions = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    name: "Scheduled Interview",
    icon: Calendar,
    path: "/scheduled-interview",
  },
  {
    name: "All Interview",
    icon: List,
    path: "/all-interview",
  },
  {
    name: "Billing",
    icon: WalletCards,
    path: "/billing",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

export const InterviewType = [
  {
    title: "Technical",
    icon: Code2Icon,
  },
  {
    title: "Behavioural",
    icon: User2Icon,
  },
  {
    title: "Experience",
    icon: BriefcaseBusinessIcon,
  },
  {
    title: "Problem Solving",
    icon: Puzzle,
  },
  {
    title: "Leadership",
    icon: Users,
  },
];

export const QUESTIONS_PROMPT = `You are an expert technical interviewer. Generate interview questions based on the job description.

Job Title: {{jobTitle}}
Job Description: {{jobDescription}}
Interview Duration: {{duration}}
Interview Type: {{type}}

CRITICAL: Your response MUST be ONLY a valid JSON array. No markdown, no code blocks, no explanations. Start with [ and end with ].

Required format:
[
  {
    "question": "Question text here",
    "type": "Technical"
  },
  {
    "question": "Another question here",
    "type": "Behavioral"
  }
]

Generate questions appropriate for {{duration}} duration based on {{jobTitle}} role. Return ONLY the JSON array, nothing else.`;

export const FEEDBACK_PROMPT = `{{conversation}}

Depends on this Interview Conversation between assitant and user, 

Give me feedback for user interview. Give me rating out of 10 for technical Skills, 

Communication, Problem Solving, Experince. Also give me summery in 3 lines 

about the interview and one line to let me know whether is recommanded 

for hire or not with msg. Give me response in JSON format

{

    feedback:{

        rating:{

            techicalSkills:5,

            communication:6,

            problemSolving:4,

            experince:7

        },

        summery:<in 3 Line>,

        Recommendation:'',

        RecommendationMsg:''



    }

}

`;
