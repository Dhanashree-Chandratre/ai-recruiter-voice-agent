import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { InterviewDataProvider } from "../context/InterviewDataContext.jsx";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI Interview",
  description: "AI Interview Platform",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <InterviewDataProvider>
            {children}
            <Toaster richColors position="top-center" />
          </InterviewDataProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
