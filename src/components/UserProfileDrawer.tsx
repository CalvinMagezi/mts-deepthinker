import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

interface UserProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfileDrawer: React.FC<UserProfileDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useUser();
  const userData = useQuery(api.users.getUserByClerkId, {
    clerkId: user?.id ?? "",
  });
  const updateUserProfile = useMutation(api.users.updateUserProfile);

  const [name, setName] = useState(userData?.name ?? "");
  const [role, setRole] = useState(userData?.role ?? "");
  const [interests, setInterests] = useState(
    userData?.interests?.join(", ") ?? ""
  );
  const [thinkingStyle, setThinkingStyle] = useState(
    userData?.thinkingStyle ?? ""
  );
  const [aiInteraction, setAiInteraction] = useState(
    userData?.aiInteraction ?? ""
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.id) {
      await updateUserProfile({
        clerkId: user.id,
        name,
        role,
        interests: interests.split(",").map((i) => i.trim()),
        thinkingStyle,
        aiInteraction,
      });
      onClose();
    }
  };

  const handleCheckboxChange = (interest: string) => {
    setInterests((prevInterests) => {
      const interestsArray = prevInterests.split(", ").filter(Boolean);
      return interestsArray.includes(interest)
        ? interestsArray.filter((i) => i !== interest).join(", ")
        : [...interestsArray, interest].join(", ");
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="h-[90vh] overflow-y-auto bg-primary_bg text-brand_gray"
      >
        <SheetHeader>
          <SheetTitle className="text-brand_green">User Profile</SheetTitle>
          <SheetDescription className="text-gray_text">
            View and edit your profile information
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label htmlFor="email" className="text-brand_gray">
              Email
            </Label>
            <Input
              id="email"
              value={userData?.email ?? ""}
              disabled
              className="bg-primary_black text-brand_gray border-gray_text"
            />
          </div>
          <div>
            <Label htmlFor="name" className="text-brand_gray">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-primary_black text-brand_gray border-gray_text"
            />
          </div>
          <div>
            <Label htmlFor="role" className="text-brand_gray">
              Role
            </Label>
            <Input
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., Student, Designer, Engineer"
              className="bg-primary_black text-brand_gray border-gray_text focus:border-brand_blue"
            />
          </div>
          <div>
            <Label className="text-brand_gray">Interests</Label>
            <div className="space-y-2">
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
                    checked={interests.split(", ").includes(interest)}
                    onCheckedChange={() => handleCheckboxChange(interest)}
                    className="w-5 h-5 border-2 border-brand_gray text-brand_blue data-[state=checked]:bg-brand_blue data-[state=checked]:text-primary_black"
                  />
                  <Label
                    htmlFor={interest}
                    className="text-brand_gray cursor-pointer"
                  >
                    {interest}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="thinkingStyle" className="text-brand_gray">
              Thinking Style
            </Label>
            <RadioGroup
              value={thinkingStyle}
              onValueChange={setThinkingStyle}
              className="space-y-2"
            >
              {[
                { value: "visual", label: "Visual (images and diagrams)" },
                {
                  value: "analytical",
                  label: "Analytical (facts and figures)",
                },
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
                    className="text-brand_gray cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="aiInteraction" className="text-brand_gray">
              AI Interaction Preference
            </Label>
            <RadioGroup
              value={aiInteraction}
              onValueChange={setAiInteraction}
              className="space-y-2"
            >
              {[
                { value: "minimal", label: "Minimal (occasional suggestions)" },
                {
                  value: "balanced",
                  label: "Balanced (regular input and ideas)",
                },
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
                    className="text-brand_gray cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <SheetFooter>
            <Button
              type="submit"
              className="bg-brand_green text-primary_black hover:bg-brand_blue"
            >
              Save Changes
            </Button>
            <SheetClose asChild>
              <Button
                variant="outline"
                className="text-brand_gray border-gray_text hover:bg-primary_black hover:text-brand_blue"
              >
                Cancel
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default UserProfileDrawer;
