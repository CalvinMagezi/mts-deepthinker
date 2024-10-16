import React from "react";
import { Thought } from "../types";

interface CanvasProps {
  children: React.ReactNode;
  thoughts: Thought[];
  width: number;
  height: number;
}

const Canvas: React.FC<CanvasProps> = ({
  children,
  thoughts,
  width,
  height,
}) => {
  return (
    <div
      id="thought-container"
      className="bg-primary_bg relative"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {thoughts.map((thought) =>
        thought.connections.map((connectionId) => {
          const connectedThought = thoughts.find((t) => t.id === connectionId);
          if (connectedThought) {
            return (
              <svg
                key={`${thought.id}-${connectionId}`}
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
      {children}
    </div>
  );
};

export default Canvas;
