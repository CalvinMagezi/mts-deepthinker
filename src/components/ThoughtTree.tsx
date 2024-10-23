import React, { useCallback, useMemo } from "react";
import { Thought } from "../types";
import ThoughtBubble from "./ThoughtBubble";
import { Id } from "@/convex/_generated/dataModel";

interface ThoughtTreeProps {
  thoughts: Thought[];
  onGenerateThought: (parentId: Id<"thoughts">) => void;
  onDrag: (id: Id<"thoughts">, x: number, y: number) => void;
  onRewrite: (id: Id<"thoughts">) => void;
  isLoading: boolean;
  scale: number;
}

const ThoughtTree: React.FC<ThoughtTreeProps> = ({
  thoughts,
  onGenerateThought,
  onDrag,
  onRewrite,
  isLoading,
  scale,
}) => {
  const renderConnections = useCallback(() => {
    return thoughts.flatMap((thought) =>
      thought.connections.map((connectionId) => {
        const connectedThought = thoughts.find((t) => t._id === connectionId);
        if (connectedThought) {
          return (
            <line
              key={`${thought._id}-${connectionId}`}
              x1={thought.x}
              y1={thought.y}
              x2={connectedThought.x}
              y2={connectedThought.y}
              stroke="#00C6FA"
              strokeWidth={2 / scale}
            />
          );
        }
        return null;
      })
    );
  }, [thoughts, scale]);

  const memoizedConnections = useMemo(renderConnections, [renderConnections]);

  const treeWidth = useMemo(() => {
    const xValues = thoughts.map((t) => t.x);
    return Math.max(...xValues) - Math.min(...xValues) + 300; // Add padding
  }, [thoughts]);

  const treeHeight = useMemo(() => {
    const yValues = thoughts.map((t) => t.y);
    return Math.max(...yValues) - Math.min(...yValues) + 300; // Add padding
  }, [thoughts]);

  return (
    <div
      className="absolute"
      style={{
        width: `${treeWidth}px`,
        height: `${treeHeight}px`,
        left: `${Math.min(...thoughts.map((t) => t.x)) - 150}px`,
        top: `${Math.min(...thoughts.map((t) => t.y)) - 150}px`,
      }}
    >
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      >
        {memoizedConnections}
      </svg>
      {thoughts.map((thought, index) => (
        <ThoughtBubble
          key={thought._id}
          thought={thought}
          index={index}
          onGenerateThought={onGenerateThought}
          onRewrite={onRewrite}
          onDrag={onDrag}
          isLoading={isLoading}
          scale={scale}
        />
      ))}
    </div>
  );
};

export default React.memo(ThoughtTree);
