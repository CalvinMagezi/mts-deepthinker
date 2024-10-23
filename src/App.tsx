import "./App.css";

import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
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
import { useTokenManager } from "./utils/tokenManager";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import OnboardingScreen from "./components/OnboardingScreen";
import SignInPage from "./components/auth/SignInPage";
import { Toaster, toast } from "react-hot-toast";
import LoadingSpinner from "./components/LoadingSpinner";

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

  const transformComponentRef = useRef<ReactZoomPanPinchRef>(null);

  const { user, isLoaded: clerkLoaded } = useUser();
  const convexUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);
  const updateOnboardingStep = useMutation(api.users.updateOnboardingStep);
  const {
    canGenerateThought,
    consumeTokens,
    getAvailableTokens,
    isLoaded: tokenManagerLoaded,
    userExists,
  } = useTokenManager(user?.id ?? "");

  useEffect(() => {
    if (user && convexUser === null && userExists === false) {
      createOrUpdateUser({
        email: user.primaryEmailAddress?.emailAddress ?? "",
        name: user.fullName ?? "",
        ip: "", // You might want to get this from the client or set it server-side
        clerkId: user.id,
      })
        .then(() => {
          toast.success("Welcome to Deep Thinker!");
        })
        .catch((error) => {
          toast.error("Error creating user profile");
          console.error(error);
        });
    }
  }, [user, convexUser, createOrUpdateUser, userExists]);

  const zoomToThought = useCallback((x: number, y: number) => {
    if (transformComponentRef.current) {
      const { setTransform } = transformComponentRef.current;
      const scale = 1.5;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const newX = centerX - x * scale;
      const newY = centerY - y * scale;

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
      if (!canGenerateThought()) {
        toast.error("You've reached your token limit for this month.");
        return;
      }

      const success = await consumeTokens();
      if (!success) {
        toast.error("Failed to consume tokens. Please try again.");
        return;
      }

      const parentThought = thoughts.find((t) => t.id === parentId);
      if (!parentThought) return;

      setIsLoading(true);
      try {
        const { thought: generatedContent } = await generateRelatedThought(
          parentThought.content,
          thoughts
        );

        const offset = 250;
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
      } catch (error) {
        console.error("Error generating thought:", error);
        toast.error("Failed to generate thought. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [canGenerateThought, consumeTokens, thoughts, zoomToThought]
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

      if (!canGenerateThought()) {
        toast.error("You've reached your token limit for this month.");
        return;
      }

      const success = await consumeTokens();
      if (!success) {
        toast.error("Failed to consume tokens. Please try again.");
        return;
      }

      setIsLoading(true);
      try {
        const { thought: rewrittenContent } = await generateRelatedThought(
          thoughtToRewrite.content,
          thoughts
        );

        setThoughts((prevThoughts) =>
          prevThoughts.map((t) =>
            t.id === id ? { ...t, content: rewrittenContent } : t
          )
        );
      } catch (error) {
        console.error("Error rewriting thought:", error);
        toast.error("Failed to rewrite thought. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [thoughts, canGenerateThought, consumeTokens]
  );

  const handleChatSubmit = useCallback(
    async (message: string) => {
      const userMessage = { role: "user", content: message };
      setChatMessages((prev) => [...prev, userMessage]);

      if (!canGenerateThought()) {
        toast.error("You've reached your token limit for this month.");
        return;
      }

      const success = await consumeTokens();
      if (!success) {
        toast.error("Failed to consume tokens. Please try again.");
        return;
      }

      try {
        const { message: aiResponse } = await chatWithPraxis(
          [...chatMessages, userMessage],
          thoughts
        );

        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", content: aiResponse },
        ]);
      } catch (error) {
        console.error("Error in chat:", error);
        toast.error("Failed to get AI response. Please try again.");
      }
    },
    [chatMessages, thoughts, canGenerateThought, consumeTokens]
  );

  if (!clerkLoaded || !tokenManagerLoaded) return <LoadingSpinner />;
  if (!user) return <SignInPage />;
  if (convexUser === undefined || userExists === false)
    return <LoadingSpinner />;

  if (convexUser && !convexUser.onboardingCompleted) {
    return (
      <OnboardingScreen
        initialData={convexUser}
        onStepComplete={(step, value) => {
          updateOnboardingStep({ clerkId: user.id, step, value })
            .then(() => {
              toast.success(`${step} updated successfully!`);
            })
            .catch((error) => {
              toast.error(`Error updating ${step}`);
              console.error(error);
            });
        }}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col bg-primary_bg text-brand_gray">
      <Toaster position="top-right" />
      <header className="bg-primary_black p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-brand_green">Deep Thinker</h1>
        <div className="flex space-x-4 items-center">
          <SignedIn>
            <UserButton />
          </SignedIn>
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
        <SignedIn>
          {showChat && (
            <ChatWindow
              isOpen={showChat}
              onClose={() => setShowChat(false)}
              messages={chatMessages}
              onSubmit={handleChatSubmit}
            />
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
                availableTokens={getAvailableTokens()}
                totalTokens={1000}
              />
            </div>
          )}
        </SignedIn>
        <SignedOut>
          <div className="flex-1 flex items-center justify-center">
            <SignIn />
          </div>
        </SignedOut>
      </main>

      <SignedIn>
        <footer className="bg-primary_black p-4">
          <AddThoughtForm onAddThought={handleAddThought} />
        </footer>
      </SignedIn>
    </div>
  );
};

export default App;
