import { SignUp } from "@clerk/clerk-react";
import { BrainCircuit } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-primary_bg flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <BrainCircuit className="w-16 h-16 mx-auto mb-4 text-brand_green" />
          <h1 className="text-4xl font-bold text-brand_gray mb-2">
            Deep Thinker
          </h1>
          <p className="text-gray_text">
            Expand your mind, one thought at a time
          </p>
        </div>
      </div>
      <SignUp signInUrl="/sign-in" />
    </div>
  );
}
