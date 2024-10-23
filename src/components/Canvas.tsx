import React from "react";
import { Thought } from "../types";
import ThoughtBubble from "./ThoughtBubble";
import { Id } from "@/convex/_generated/dataModel";

interface CanvasProps {
  thoughts: Thought[];
  width: number;
  height: number;
  onGenerateThought: (
    parentId: Id<"thoughts">,
    direction: "top" | "right" | "bottom" | "left"
  ) => void;
  onDrag: (id: Id<"thoughts">, x: number, y: number) => void;
  onRewrite: (id: Id<"thoughts">) => void;
  isLoading: boolean;
}

const Canvas: React.FC<CanvasProps> = ({
  thoughts,
  width,
  height,
  onGenerateThought,
  onDrag,
  onRewrite,
  isLoading,
}) => {
  return (
    <div
      id="thought-container"
      className="bg-primary_bg relative"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {thoughts.map((thought) =>
        thought.connections.map((connectionId) => {
          const connectedThought = thoughts.find((t) => t._id === connectionId);
          if (connectedThought) {
            return (
              <svg
                key={`${thought._id}-${connectionId}`}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{ zIndex: 0 }}
              >
                <line
                  x1={thought.x}
                  y1={thought.y}
                  x2={connectedThought.x}
                  y2={connectedThought.y}
                  stroke="#00C6FA"
                  strokeWidth="2"
                />
              </svg>
            );
          }
          return null;
        })
      )}
      {thoughts.map((thought) => (
        <ThoughtBubble
          key={thought._id}
          thought={thought}
          onGenerateThought={onGenerateThought}
          onDrag={onDrag}
          onRewrite={onRewrite}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};

export default Canvas;
