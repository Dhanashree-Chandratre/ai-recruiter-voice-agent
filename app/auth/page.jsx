"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import { Button } from "../../components/ui/button.jsx";
import { supabase } from "../../services/supabaseClient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function Login() {
  const router = useRouter();

  useEffect(() => {
    // Check if we're already authenticated
    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (session) {
          console.log("🔑 Existing session found:", session.user.email);
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };

    checkSession();
  }, [router]);

  const signInWithGoogle = async () => {
    try {
      console.log("🔑 Starting Google sign in process...");

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
            // login_hint: 'AInterview', // Not supported for branding, but included for completeness
          },
          // appearance: { brand: 'AInterview' }, // Not supported by supabase-js as of now
        },
      });

      if (error) {
        console.error("❌ Error signing in:", error);
        toast.error("Failed to sign in. Please try again.");
        return;
      }

      console.log("✅ Sign in initiated successfully:", data);
    } catch (error) {
      console.error("❌ Error in signInWithGoogle:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center border rounded-2xl p-8">
        <Image
          src={"/logo.png"}
          alt="logo"
          width={100}
          height={100}
          className="w-[180px]"
        />

        <div className="flex items-center flex-col">
          <Image
            src={"/login.png"}
            alt="login"
            width={600}
            height={400}
            className="w-[400px] h-[250px] rounded-2xl"
          />

          <h2 className="text-2xl font-bold text-center mt-5">
            Welcome to AInterview
          </h2>
          <p className="text-gray-500 text-center">
            Sign In with Google Authentication
          </p>
          <Button className="mt-7 w-full" onClick={signInWithGoogle}>
            {" "}
            Login with Google{" "}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
