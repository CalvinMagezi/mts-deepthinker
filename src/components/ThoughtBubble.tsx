import React, { useRef } from "react";
import { Thought } from "../types";
import { Plus, Loader2, Pencil, Zap, MoreHorizontal } from "lucide-react";
import Draggable, { DraggableEvent, DraggableData } from "react-draggable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Id } from "@/convex/_generated/dataModel";

interface ThoughtBubbleProps {
  thought: Thought;
  onGenerateThought: (
    parentId: Id<"thoughts">,
    direction: "top" | "right" | "bottom" | "left"
  ) => void;
  onDrag: (id: Id<"thoughts">, x: number, y: number) => void;
  onRewrite: (id: Id<"thoughts">) => void;
  isLoading: boolean;
}

const ThoughtBubble: React.FC<ThoughtBubbleProps> = ({
  thought,
  onGenerateThought,
  onDrag,
  onRewrite,
  isLoading,
}) => {
  const nodeRef = useRef(null);

  const handleDragStart = (e: DraggableEvent) => {
    e.stopPropagation();
  };

  const handleDrag = (e: DraggableEvent, data: DraggableData) => {
    e.stopPropagation();
    onDrag(thought._id, data.x, data.y);
  };

  const handleActionSelect = (
    action: "ai" | "manual" | "rewrite",
    direction?: "top" | "right" | "bottom" | "left"
  ) => {
    if (action === "ai" && direction) {
      onGenerateThought(thought._id, direction);
    } else if (action === "rewrite") {
      onRewrite(thought._id);
    }
    // For 'manual', we'll need to implement a way to add a new thought manually
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      position={{ x: thought.x, y: thought.y }}
      onStart={handleDragStart}
      onDrag={handleDrag}
      onStop={handleDrag}
      bounds="parent"
    >
      <Card
        ref={nodeRef}
        id={`thought-${thought._id}`}
        className="absolute w-64 sm:w-72 md:w-80 cursor-move bg-gradient-to-br from-brand_black to-primary_black border-brand_blue shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-102"
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-brand_gray flex-grow mr-2">
              {thought.content}
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4 text-brand_gray" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-primary_black border-brand_blue"
              >
                <DropdownMenuItem
                  onClick={() => handleActionSelect("rewrite")}
                  className="text-brand_gray hover:text-primary_black hover:bg-brand_blue"
                >
                  <Zap className="mr-2 h-4 w-4" /> Rewrite with AI
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleActionSelect("manual")}
                  className="text-brand_gray hover:text-primary_black hover:bg-brand_blue"
                >
                  <Pencil className="mr-2 h-4 w-4" /> Write manually
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex justify-around mt-4">
            {["top", "right", "bottom", "left"].map((direction) => (
              <TooltipProvider key={direction}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 rounded-full bg-brand_green hover:bg-brand_blue transition-colors"
                      onClick={() =>
                        handleActionSelect(
                          "ai",
                          direction as "top" | "right" | "bottom" | "left"
                        )
                      }
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-primary_black" />
                      ) : (
                        <Plus className="h-4 w-4 text-primary_black" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side={direction as "top" | "right" | "bottom" | "left"}
                  >
                    <p>Generate thought ({direction})</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </CardContent>
      </Card>
    </Draggable>
  );
};

export default ThoughtBubble;
