"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import OnboardingContent from "./components/OnboardingContent";
import PreLoader from "@components/PreLoader";

export default function Onboarding() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Wait for session to load
    if (status === "loading") return;

    // If user is authenticated and not a new account, redirect to dashboard
    if (session?.user && !session.user.isNewAccount) {
      router.replace("/dashboard/home");
      return;
    }

    // Otherwise, show onboarding with a delay
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [session, status, router]);

  return (
    <main>
      {!isLoaded || status === "loading" ? <PreLoader /> : <OnboardingContent />}
    </main>
  );
}
