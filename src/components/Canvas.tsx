import React, { useCallback, useMemo, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Thought } from "../types";
import ThoughtTree from "./ThoughtTree";
import { Id } from "@/convex/_generated/dataModel";
import { ZoomIn, ZoomOut, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CanvasProps {
  thoughts: Thought[];
  width: number;
  height: number;
  onGenerateThought: (parentId: Id<"thoughts">) => void;
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
  const [scale, setScale] = useState(1);

  const rootThoughts = useMemo(() => {
    return thoughts.filter(
      (thought) => !thoughts.some((t) => t.connections.includes(thought._id))
    );
  }, [thoughts]);

  const getThoughtTree = useCallback(
    (rootId: Id<"thoughts">) => {
      const tree: Thought[] = [];
      const addToTree = (id: Id<"thoughts">) => {
        const thought = thoughts.find((t) => t._id === id);
        if (thought) {
          tree.push(thought);
          thought.connections.forEach(addToTree);
        }
      };
      addToTree(rootId);
      return tree;
    },
    [thoughts]
  );

  return (
    <TransformWrapper
      initialScale={1}
      minScale={0.1}
      maxScale={4}
      wheel={{ disabled: true }}
      pinch={{ disabled: false }}
      doubleClick={{ disabled: true }}
      onZoom={({ state }) => setScale(state.scale)}
    >
      {({ zoomIn, zoomOut, resetTransform }) => (
        <>
          <TransformComponent
            wrapperStyle={{
              width: "100%",
              height: "100%",
              overflow: "hidden",
            }}
          >
            <div
              className="bg-primary_bg relative"
              style={{ width: `${width}px`, height: `${height}px` }}
            >
              {rootThoughts.map((rootThought) => (
                <div
                  key={rootThought._id}
                  className="thought-tree-container bg-primary_bg_light rounded-lg shadow-md overflow-hidden"
                  style={{
                    position: "absolute",
                    left: `${rootThought.x}px`,
                    top: `${rootThought.y}px`,
                    padding: "16px",
                    margin: "8px",
                  }}
                >
                  <ThoughtTree
                    thoughts={getThoughtTree(rootThought._id)}
                    onGenerateThought={onGenerateThought}
                    onDrag={onDrag}
                    onRewrite={onRewrite}
                    isLoading={isLoading}
                    scale={scale}
                  />
                </div>
              ))}
            </div>
          </TransformComponent>
          <div className="absolute bottom-4 right-4 z-10 flex space-x-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => zoomOut(0.1)}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" onClick={() => zoomIn(0.1)}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => resetTransform()}
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </TransformWrapper>
  );
};

export default React.memo(Canvas);
