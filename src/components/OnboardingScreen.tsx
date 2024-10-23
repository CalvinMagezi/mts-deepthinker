import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BrainCircuit,
  Lightbulb,
  Sparkles,
  ArrowRight,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // or your routing library
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useUser } from "@clerk/clerk-react";

interface UserData {
  name: string;
  role: string;
  interests: string[];
  thinkingStyle: string;
  aiInteraction: string;
}

interface OnboardingScreenProps {
  initialData: Partial<UserData>;
  onStepComplete: (step: string, value: unknown) => void;
}

export default function OnboardingScreen({
  initialData,
  onStepComplete,
}: OnboardingScreenProps) {
  const navigate = useNavigate();
  const { user } = useUser();
  const updateOnboardingStep = useMutation(api.users.updateOnboardingStep);
  const getInitialCanvasId = useQuery(api.users.getInitialCanvasId, {
    clerkId: user?.id as string,
  });
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState<UserData>({
    name: initialData.name || "",
    role: initialData.role || "",
    interests: initialData.interests || [],
    thinkingStyle: initialData.thinkingStyle || "",
    aiInteraction: initialData.aiInteraction || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (interest: string) => {
    setUserData({
      ...userData,
      interests: userData.interests.includes(interest)
        ? userData.interests.filter((i) => i !== interest)
        : [...userData.interests, interest],
    });
  };

  const handleNext = () => {
    onStepComplete(
      Object.keys(userData)[step],
      userData[Object.keys(userData)[step] as keyof UserData]
    );
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleComplete = async () => {
    const { canvasId } = await updateOnboardingStep({
      clerkId: user?.id as string,
      step: "aiInteraction",
      value: userData.aiInteraction,
    });

    if (canvasId) {
      navigate(`/canvas/${canvasId}`);
    } else {
      console.error("No canvas ID returned after onboarding");
      // Handle this error case appropriately
    }
  };

  // Use this effect to redirect if the user already has an initial canvas
  useEffect(() => {
    if (getInitialCanvasId) {
      navigate(`/canvas/${getInitialCanvasId}`);
    }
  }, [getInitialCanvasId, navigate]);

  const steps = [
    // Welcome
    <Card
      key="welcome"
      className="w-full max-w-md mx-auto bg-primary_bg border-brand_blue"
    >
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-brand_blue">
          Welcome to Deep Thinker
        </CardTitle>
        <CardDescription className="text-brand_gray">
          Let's customize your thought exploration experience
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <BrainCircuit className="w-24 h-24 text-brand_green" />
        <p className="text-center text-white">
          Deep Thinker is an AI-powered tool that helps you visualize and expand
          your ideas using a canvas-based interface.
        </p>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleNext}
          className="w-full bg-brand_blue text-primary_black hover:bg-brand_green"
        >
          Get Started <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>,

    // Name and Role
    <Card
      key="nameRole"
      className="w-full max-w-md mx-auto bg-primary_bg border-brand_blue"
    >
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-brand_blue">
          Tell us about yourself
        </CardTitle>
        <CardDescription className="text-brand_gray">
          This helps us personalize your experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            value={userData.name}
            onChange={handleInputChange}
            placeholder="Your name"
            className="bg-brand_black text-white placeholder-gray-400 border-brand_gray focus:border-brand_blue"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role" className="text-white">
            Role
          </Label>
          <Input
            id="role"
            name="role"
            value={userData.role}
            onChange={handleInputChange}
            placeholder="e.g., Student, Designer, Engineer"
            className="bg-brand_black text-white placeholder-gray-400 border-brand_gray focus:border-brand_blue"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          onClick={handleBack}
          variant="outline"
          className="bg-transparent border-brand_blue text-brand_blue hover:bg-brand_blue hover:text-primary_black"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button
          onClick={handleNext}
          className="bg-brand_blue text-primary_black hover:bg-brand_green"
          disabled={!userData.name || !userData.role}
        >
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>,

    // Interests
    <Card
      key="interests"
      className="w-full max-w-md mx-auto bg-primary_bg border-brand_blue"
    >
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-brand_blue">
          What are you interested in?
        </CardTitle>
        <CardDescription className="text-brand_gray">
          Select all that apply
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {[
          "Technology",
          "Science",
          "Art",
          "Philosophy",
          "Business",
          "Health",
        ].map((interest) => (
          <div key={interest} className="flex items-center space-x-2">
            <Checkbox
              id={interest}
              checked={userData.interests.includes(interest)}
              onCheckedChange={() => handleCheckboxChange(interest)}
              className="w-5 h-5 border-2 border-brand_gray text-brand_blue data-[state=checked]:bg-brand_blue data-[state=checked]:text-primary_black"
            />
            <Label htmlFor={interest} className="text-white cursor-pointer">
              {interest}
            </Label>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          onClick={handleBack}
          variant="outline"
          className="bg-transparent border-brand_blue text-brand_blue hover:bg-brand_blue hover:text-primary_black"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button
          onClick={handleNext}
          className="bg-brand_blue text-primary_black hover:bg-brand_green"
          disabled={userData.interests.length === 0}
        >
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>,

    // Thinking Style
    <Card
      key="thinkingStyle"
      className="w-full max-w-md mx-auto bg-primary_bg border-brand_blue"
    >
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-brand_blue">
          How do you prefer to think?
        </CardTitle>
        <CardDescription className="text-brand_gray">
          Choose the style that best describes you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup
          value={userData.thinkingStyle}
          onValueChange={(value) =>
            setUserData({ ...userData, thinkingStyle: value })
          }
          className="space-y-2"
        >
          {[
            { value: "visual", label: "Visual (images and diagrams)" },
            { value: "analytical", label: "Analytical (facts and figures)" },
            {
              value: "creative",
              label: "Creative (brainstorming and free association)",
            },
          ].map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option.value}
                id={option.value}
                className="w-5 h-5 border-2 border-brand_gray text-brand_blue data-[state=checked]:bg-brand_blue data-[state=checked]:border-brand_blue"
              />
              <Label
                htmlFor={option.value}
                className="text-white cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          onClick={handleBack}
          variant="outline"
          className="bg-transparent border-brand_blue text-brand_blue hover:bg-brand_blue hover:text-primary_black"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button
          onClick={handleNext}
          className="bg-brand_blue text-primary_black hover:bg-brand_green"
          disabled={!userData.thinkingStyle}
        >
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>,

    // AI Interaction
    <Card
      key="aiInteraction"
      className="w-full max-w-md mx-auto bg-primary_bg border-brand_blue"
    >
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-brand_blue">
          How would you like to interact with AI?
        </CardTitle>
        <CardDescription className="text-brand_gray">
          Choose your preferred AI assistance level
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup
          value={userData.aiInteraction}
          onValueChange={(value) =>
            setUserData({ ...userData, aiInteraction: value })
          }
          className="space-y-2"
        >
          {[
            { value: "minimal", label: "Minimal (occasional suggestions)" },
            { value: "balanced", label: "Balanced (regular input and ideas)" },
            {
              value: "proactive",
              label: "Proactive (frequent AI-driven insights)",
            },
          ].map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option.value}
                id={option.value}
                className="w-5 h-5 border-2 border-brand_gray text-brand_blue data-[state=checked]:bg-brand_blue data-[state=checked]:border-brand_blue"
              />
              <Label
                htmlFor={option.value}
                className="text-white cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          onClick={handleBack}
          variant="outline"
          className="bg-transparent border-brand_blue text-brand_blue hover:bg-brand_blue hover:text-primary_black"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button
          onClick={handleComplete}
          className="bg-brand_blue text-primary_black hover:bg-brand_green"
          disabled={!userData.aiInteraction}
        >
          Complete Setup <CheckCircle className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>,

    // Completion
    <Card
      key="completion"
      className="w-full max-w-md mx-auto bg-primary_bg border-brand_green"
    >
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-brand_green">
          You're all set!
        </CardTitle>
        <CardDescription className="text-brand_gray">
          Your Deep Thinker experience is ready
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <Sparkles className="w-24 h-24 text-brand_blue" />
        <p className="text-center text-white">
          Welcome aboard, {userData.name}! We've customized Deep Thinker based
          on your preferences. You're ready to start exploring and expanding
          your ideas.
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-brand_green text-primary_black hover:bg-brand_blue">
          Enter Deep Thinker <Lightbulb className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>,
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-app_black to-primary_bg flex items-center justify-center p-4">
      {steps[step]}
    </div>
  );
}
