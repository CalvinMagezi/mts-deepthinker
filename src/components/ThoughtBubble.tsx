import React, { useCallback, useEffect, useState } from "react";
import { Thought } from "../types";
import { Plus, Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Id } from "@/convex/_generated/dataModel";
import { useDrag } from "@use-gesture/react";

interface ThoughtBubbleProps {
  thought: Thought;
  index: number;
  onGenerateThought: (parentId: Id<"thoughts">) => void;
  onRewrite: (id: Id<"thoughts">) => void;
  onDrag: (id: Id<"thoughts">, x: number, y: number) => void;
  isLoading: boolean;
  scale: number;
}

const ThoughtBubble: React.FC<ThoughtBubbleProps> = ({
  thought,
  index,
  onGenerateThought,
  onRewrite,
  onDrag,
  isLoading,
  scale,
}) => {
  const [position, setPosition] = useState({ x: thought.x, y: thought.y });
  console.log(index);

  useEffect(() => {
    setPosition({ x: thought.x, y: thought.y });
  }, [thought.x, thought.y]);

  const bind = useDrag(({ movement: [mx, my], last }) => {
    const newX = position.x + mx / scale;
    const newY = position.y + my / scale;
    setPosition({ x: newX, y: newY });
    if (last) {
      onDrag(thought._id, newX, newY);
    }
  });

  const handleGenerateThought = useCallback(() => {
    onGenerateThought(thought._id);
  }, [thought._id, onGenerateThought]);

  const handleRewrite = useCallback(() => {
    onRewrite(thought._id);
  }, [thought._id, onRewrite]);

  return (
    <Card
      {...bind()}
      id={`thought-${thought._id}`}
      className="absolute w-64 sm:w-72 md:w-80 cursor-move bg-gradient-to-br from-brand_black to-primary_black border-brand_blue shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-102"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        touchAction: "none",
        transform: `scale(${1 / scale})`,
        transformOrigin: "top left",
      }}
    >
      <CardContent className="p-4">
        <p className="text-sm font-medium text-brand_gray mb-4">
          {thought.content}
        </p>
        <div className="flex justify-between items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-brand_green hover:bg-brand_blue transition-colors"
                  onClick={handleGenerateThought}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-primary_black" />
                  ) : (
                    <Plus className="h-4 w-4 text-primary_black" />
                  )}
                  <span className="ml-2">Generate</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Generate new thought</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button
            size="sm"
            variant="ghost"
            className="text-brand_gray hover:text-brand_blue"
            onClick={handleRewrite}
          >
            <Zap className="h-4 w-4 mr-2" />
            Rewrite
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(ThoughtBubble);
