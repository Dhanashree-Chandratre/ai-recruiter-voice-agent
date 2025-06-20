# AI Recruiter Voice Agent

AI Recruiter Voice Agent is a modern web application designed to streamline and automate the interview process using AI-driven voice interactions. The platform enables recruiters to schedule, conduct, and review interviews efficiently, leveraging advanced AI feedback and analytics.

## Features

- **AI-Powered Interviews:** Conduct interviews with AI-generated questions and real-time feedback.
- **Voice Interaction:** Seamless voice-based interview experience for candidates.
- **Interview Scheduling:** Schedule and manage interviews with an intuitive dashboard.
- **Candidate Feedback:** Collect and review AI-generated feedback for each candidate.
- **User Management:** Secure authentication and user profile management.
- **Modern UI:** Responsive and user-friendly interface built with React and Next.js.

## Project Structure

```
ai-interview/
  app/                # Main Next.js application
    (main)/           # Main application pages and components
    api/              # API routes for AI feedback, models, and feedback saving
    auth/             # Authentication pages
    interview/        # Interview flow and components
    components/       # Shared UI components
    context/          # React context providers
    hooks/            # Custom React hooks
    lib/              # Utility libraries (Supabase, user storage, etc.)
    services/         # Service layer (constants, Supabase client)
    public/           # Static assets
  package.json        # Project dependencies
  README.md           # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/ai-recruiter-voice-agent.git
   cd ai-recruiter-voice-agent/ai-interview
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**

   - Copy `.env.example` to `.env.local` and fill in the required values (Supabase keys, etc.).

4. **Run the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser:**
   - Visit [http://localhost:3000](http://localhost:3000) to view the app.

## Technologies Used

- **Next.js** – React framework for server-side rendering and routing
- **React** – UI library
- **Supabase** – Backend as a Service (authentication, database)
- **Tailwind CSS / PostCSS** – Styling
- **Vercel** – Deployment (optional)

## Contributing

Contributions are welcome! Please open issues or submit pull requests for any features, bug fixes, or improvements.

## License

This project is licensed under the MIT License.
