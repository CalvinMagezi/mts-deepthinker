import React, { useState, useEffect } from "react";
import { Plus, Sparkles, Lightbulb } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AddThoughtFormProps {
  onAddThought: (content: string) => void;
}

const suggestions = [
  "What if we could teleport?",
  "How might AI impact education?",
  "Imagine a world without social media",
  "What's the future of space exploration?",
  "How can we solve climate change?",
  "What if animals could talk?",
  "Describe a day in 2100",
  "Invent a new sport",
  "Design a city of the future",
  "What if we could read minds?",
];

const AddThoughtForm: React.FC<AddThoughtFormProps> = ({ onAddThought }) => {
  const [content, setContent] = useState("");
  const [displayedSuggestions, setDisplayedSuggestions] = useState<string[]>(
    []
  );

  useEffect(() => {
    updateSuggestions();
  }, []);

  const updateSuggestions = () => {
    const shuffled = [...suggestions].sort(() => 0.5 - Math.random());
    setDisplayedSuggestions(shuffled.slice(0, 3));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onAddThought(content.trim());
      setContent("");
      updateSuggestions();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onAddThought(suggestion);
    updateSuggestions();
  };

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4">
      <div className="mb-4 flex flex-wrap justify-center gap-2">
        {displayedSuggestions.map((suggestion, index) => (
          <Badge
            key={index}
            variant="outline"
            className="bg-brand_blue/30 hover:bg-brand_blue/50 text-brand_gray border-brand_green border-opacity-50 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-md hover:shadow-brand_green/30 px-3 py-2 rounded-full"
            onClick={() => handleSuggestionClick(suggestion)}
          >
            <Lightbulb className="w-5 h-5 mr-2 text-brand_green animate-pulse" />
            <span className="font-medium">{suggestion}</span>
          </Badge>
        ))}
      </div>
      <Card className="bg-primary_black border-brand_green border-opacity-30 shadow-lg shadow-brand_green/20 backdrop-blur-sm">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row p-4 gap-4"
        >
          <div className="relative flex-grow group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Sparkles className="h-5 w-5 text-brand_green opacity-70 group-hover:opacity-100 transition-opacity" />
            </div>
            <Input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter a thought..."
              className="w-full bg-primary_bg/50 text-brand_gray border-brand_blue focus:border-brand_green focus:ring-brand_green placeholder-gray_text pl-10 pr-4 py-6 rounded-lg transition-all duration-300 ease-in-out"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <div className="w-2 h-2 rounded-full bg-brand_green animate-pulse"></div>
            </div>
          </div>
          <Button
            type="submit"
            className="bg-brand_green text-primary_black hover:bg-brand_blue focus:ring-2 focus:ring-brand_green focus:ring-offset-2 focus:ring-offset-primary_black transition-all duration-300 ease-in-out transform hover:scale-105 rounded-lg py-6"
          >
            <Plus size={24} className="mr-2" />
            Add Thought
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AddThoughtForm;
