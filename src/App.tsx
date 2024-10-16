import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import { Settings, MessageSquare } from "lucide-react";
import Canvas from "./components/Canvas";
import ThoughtBubble from "./components/ThoughtBubble";
import AddThoughtForm from "./components/AddThoughtForm";
import TokenDisplay from "./components/TokenDisplay";
import ChatWindow from "./components/ChatWindow";
import { Thought } from "./types";
import { generateRelatedThought, chatWithPraxis } from "./utils/ai";
import {
  initializeTokenManager,
  updateTokenUsage,
  getTokenData,
  getAvailableCustomTokens,
  canGenerateThought,
} from "./utils/tokenManager";

const CANVAS_WIDTH = 4000;
const CANVAS_HEIGHT = 4000;

const App: React.FC = () => {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    { role: string; content: string }[]
  >([]);
  const [tokenData, setTokenData] = useState({
    apiTokensUsed: 0,
    totalCost: 0,
    ipAddress: "",
  });

  const transformComponentRef = useRef<ReactZoomPanPinchRef>(null);

  useEffect(() => {
    initializeTokenManager().then(setTokenData);
  }, []);

  const zoomToThought = useCallback((x: number, y: number) => {
    if (transformComponentRef.current) {
      const { setTransform } = transformComponentRef.current;
      const scale = 1.5;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // Calculate the position to center the thought
      const newX = centerX - x * scale;
      const newY = centerY - y * scale;

      // Animate to the new position and scale
      setTransform(newX, newY, scale, 500);
    }
  }, []);

  const handleAddThought = useCallback(
    (content: string) => {
      const newThought: Thought = {
        id: Date.now(),
        content,
        x: CANVAS_WIDTH / 2,
        y: CANVAS_HEIGHT / 2,
        connections: [],
      };
      setThoughts((prevThoughts) => [...prevThoughts, newThought]);

      // Use setTimeout to ensure the thought is added before zooming
      setTimeout(() => {
        zoomToThought(newThought.x, newThought.y);
      }, 50);
    },
    [zoomToThought]
  );

  const handleGenerateThought = useCallback(
    async (
      parentId: number,
      direction: "top" | "right" | "bottom" | "left"
    ) => {
      const parentThought = thoughts.find((t) => t.id === parentId);
      if (!parentThought) return;

      setIsLoading(true);
      const {
        thought: generatedContent,
        tokensUsed,
        cost,
      } = await generateRelatedThought(parentThought.content, thoughts);
      setIsLoading(false);

      if (!canGenerateThought(tokensUsed)) {
        alert(
          "You've reached your token limit. Unable to generate more thoughts."
        );
        return;
      }

      updateTokenUsage(tokensUsed, cost);
      setTokenData(getTokenData());

      const offset = 250; // Distance between thoughts
      let x = parentThought.x;
      let y = parentThought.y;

      switch (direction) {
        case "top":
          y -= offset;
          break;
        case "right":
          x += offset;
          break;
        case "bottom":
          y += offset;
          break;
        case "left":
          x -= offset;
          break;
      }

      const newThought: Thought = {
        id: Date.now(),
        content: generatedContent,
        x,
        y,
        connections: [parentId],
      };

      setThoughts((prevThoughts) =>
        prevThoughts
          .map((t) =>
            t.id === parentId
              ? { ...t, connections: [...t.connections, newThought.id] }
              : t
          )
          .concat(newThought)
      );

      zoomToThought(newThought.x, newThought.y);
    },
    [thoughts, zoomToThought]
  );

  const handleDrag = useCallback((id: number, x: number, y: number) => {
    setThoughts((prevThoughts) =>
      prevThoughts.map((thought) =>
        thought.id === id ? { ...thought, x, y } : thought
      )
    );
  }, []);

  const handleRewrite = useCallback(
    async (id: number) => {
      const thoughtToRewrite = thoughts.find((t) => t.id === id);
      if (!thoughtToRewrite) return;

      setIsLoading(true);
      const {
        thought: rewrittenContent,
        tokensUsed,
        cost,
      } = await generateRelatedThought(thoughtToRewrite.content, thoughts);
      setIsLoading(false);

      if (!canGenerateThought(tokensUsed)) {
        alert(
          "You've reached your token limit. Unable to rewrite the thought."
        );
        return;
      }

      updateTokenUsage(tokensUsed, cost);
      setTokenData(getTokenData());

      setThoughts((prevThoughts) =>
        prevThoughts.map((t) =>
          t.id === id ? { ...t, content: rewrittenContent } : t
        )
      );
    },
    [thoughts]
  );

  const handleChatSubmit = useCallback(
    async (message: string) => {
      const userMessage = { role: "user", content: message };
      setChatMessages((prev) => [...prev, userMessage]);

      const {
        message: aiResponse,
        tokensUsed,
        cost,
      } = await chatWithPraxis([...chatMessages, userMessage], thoughts);

      if (!canGenerateThought(tokensUsed)) {
        alert("You've reached your token limit. Unable to continue the chat.");
        return;
      }

      updateTokenUsage(tokensUsed, cost);
      setTokenData(getTokenData());

      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiResponse },
      ]);
    },
    [chatMessages, thoughts]
  );

  return (
    <div className="h-screen flex flex-col bg-primary_bg text-brand_gray">
      <header className="bg-primary_black p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-brand_green">Deep Thinker</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowChat(!showChat)}
            className="p-2 rounded-full bg-brand_blue text-primary_black hover:bg-brand_green transition-colors"
          >
            <MessageSquare size={24} />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-full bg-brand_blue text-primary_black hover:bg-brand_green transition-colors"
          >
            <Settings size={24} />
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {showChat && (
          <div className="w-1/3 bg-primary_black border-r border-brand_blue">
            <ChatWindow messages={chatMessages} onSubmit={handleChatSubmit} />
          </div>
        )}
        <div
          className={`flex-1 ${
            showChat ? "w-2/3" : "w-full"
          } relative overflow-hidden`}
        >
          <TransformWrapper
            initialScale={1}
            minScale={0.1}
            maxScale={3}
            limitToBounds={false}
            ref={transformComponentRef}
            centerOnInit={true}
          >
            <TransformComponent
              wrapperStyle={{ width: "100%", height: "100%" }}
              contentStyle={{
                width: `${CANVAS_WIDTH}px`,
                height: `${CANVAS_HEIGHT}px`,
              }}
            >
              <div id="thought-container">
                <Canvas
                  thoughts={thoughts}
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                >
                  {thoughts.map((thought) => (
                    <ThoughtBubble
                      key={thought.id}
                      thought={thought}
                      onGenerateThought={handleGenerateThought}
                      onDrag={handleDrag}
                      onRewrite={handleRewrite}
                      isLoading={isLoading}
                    />
                  ))}
                </Canvas>
              </div>
            </TransformComponent>
          </TransformWrapper>
        </div>

        {showSettings && (
          <div className="absolute top-16 right-4 z-10">
            <TokenDisplay
              apiTokensUsed={tokenData.apiTokensUsed}
              totalCost={tokenData.totalCost}
              availableCustomTokens={getAvailableCustomTokens()}
              ipAddress={tokenData.ipAddress}
            />
          </div>
        )}
      </main>

      <footer className="bg-primary_black p-4">
        <AddThoughtForm onAddThought={handleAddThought} />
      </footer>
    </div>
  );
};

export default App;
