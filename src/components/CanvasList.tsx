import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Id } from "@/convex/_generated/dataModel";

const CanvasList: React.FC = () => {
  const { user } = useUser();
  const canvases = useQuery(
    api.canvases.getCanvasesForUser,
    user?.id ? { userId: user.id as Id<"users"> } : "skip"
  );

  if (!canvases) return <div>Loading canvases...</div>;

  return (
    <div className="bg-primary_bg p-4 rounded-lg">
      <h2 className="text-xl font-bold text-brand_green mb-4">Your Canvases</h2>
      <ul className="space-y-2">
        {canvases.map((canvas) => (
          <li key={canvas._id}>
            <Link
              to={`/canvas/${canvas._id}`}
              className="block p-2 bg-primary_black text-brand_gray hover:bg-brand_blue hover:text-primary_black transition-colors rounded"
            >
              {canvas.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CanvasList;
