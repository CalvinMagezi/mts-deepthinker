import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import LoadingSpinner from "./LoadingSpinner";
import App from "../App";

const CanvasRouter: React.FC = () => {
  const { user } = useUser();
  const { canvasId } = useParams();
  const navigate = useNavigate();

  const convexUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );
  const createCanvas = useMutation(api.canvases.createCanvas);

  useEffect(() => {
    if (!user || !convexUser) return;

    const initializeCanvas = async () => {
      if (!canvasId) {
        if (convexUser.initialCanvasId) {
          navigate(`/dashboard/${convexUser.initialCanvasId}`);
        } else {
          // Create a new canvas if the user doesn't have an initial canvas
          try {
            const newCanvasId = await createCanvas({
              userId: user.id,
              name: "My First Canvas",
            });
            navigate(`/dashboard/${newCanvasId}`);
          } catch (error) {
            console.error("Error creating initial canvas:", error);
            // Handle error (e.g., show a toast message)
          }
        }
      }
    };

    initializeCanvas();
  }, [user, convexUser, canvasId, createCanvas, navigate]);

  if (!user || convexUser === undefined) {
    return <LoadingSpinner />;
  }

  // Render the App component with the current canvasId
  return <App />;
};

export default CanvasRouter;
