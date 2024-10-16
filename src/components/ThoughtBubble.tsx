import React, { useState, useRef } from 'react';
import { Thought } from '../types';
import { Plus, Loader2, Pencil, Zap } from 'lucide-react';
import Draggable, { DraggableEvent, DraggableData } from 'react-draggable';

interface ThoughtBubbleProps {
  thought: Thought;
  onGenerateThought: (parentId: number, direction: 'top' | 'right' | 'bottom' | 'left') => void;
  onDrag: (id: number, x: number, y: number) => void;
  onRewrite: (id: number) => void;
  isLoading: boolean;
}

const ThoughtBubble: React.FC<ThoughtBubbleProps> = ({ thought, onGenerateThought, onDrag, onRewrite, isLoading }) => {
  const [showActions, setShowActions] = useState(false);
  const [actionDirection, setActionDirection] = useState<'top' | 'right' | 'bottom' | 'left' | null>(null);
  const nodeRef = useRef(null);

  const handleDragStart = (e: DraggableEvent) => {
    e.stopPropagation();
  };

  const handleDrag = (e: DraggableEvent, data: DraggableData) => {
    e.stopPropagation();
    onDrag(thought.id, data.x, data.y);
  };

  const handleActionClick = (direction: 'top' | 'right' | 'bottom' | 'left') => {
    setShowActions(true);
    setActionDirection(direction);
  };

  const handleActionSelect = (action: 'ai' | 'manual' | 'rewrite') => {
    setShowActions(false);
    if (action === 'ai' && actionDirection) {
      onGenerateThought(thought.id, actionDirection);
    } else if (action === 'rewrite') {
      onRewrite(thought.id);
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
      <div
        ref={nodeRef}
        id={`thought-${thought.id}`}
        className="absolute bg-gradient-to-br from-brand_black to-primary_black rounded-xl p-4 shadow-lg border-2 border-brand_blue transition-all hover:shadow-xl hover:scale-105 cursor-move"
        style={{ width: '200px', minHeight: '100px' }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {['top', 'right', 'bottom', 'left'].map((direction) => (
          <button
            key={direction}
            className={`absolute bg-brand_green rounded-full p-1 hover:bg-brand_blue transition-colors ${
              direction === 'top' ? '-top-3 left-1/2 -translate-x-1/2' :
              direction === 'right' ? '-right-3 top-1/2 -translate-y-1/2' :
              direction === 'bottom' ? '-bottom-3 left-1/2 -translate-x-1/2' :
              '-left-3 top-1/2 -translate-y-1/2'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              handleActionClick(direction as any);
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin text-primary_black" />
            ) : (
              <Plus size={16} className="text-primary_black" />
            )}
          </button>
        ))}
        <p className="text-sm font-medium text-brand_gray">{thought.content}</p>
        {showActions && (
          <div className={`absolute ${
            actionDirection === 'top' ? 'top-full left-1/2 -translate-x-1/2 mt-2' :
            actionDirection === 'right' ? 'left-full top-1/2 -translate-y-1/2 ml-2' :
            actionDirection === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 mb-2' :
            'right-full top-1/2 -translate-y-1/2 mr-2'
          } bg-primary_black border border-brand_blue rounded-md shadow-lg p-2 z-10`}>
            <button
              className="flex items-center justify-center w-full p-2 mb-2 bg-brand_green text-primary_black rounded hover:bg-brand_blue transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleActionSelect('ai');
              }}
            >
              <Zap size={16} className="mr-2" /> Continue with Praxis
            </button>
            <button
              className="flex items-center justify-center w-full p-2 mb-2 bg-brand_gray text-primary_black rounded hover:bg-gray_text transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleActionSelect('manual');
              }}
            >
              <Pencil size={16} className="mr-2" /> Write manually
            </button>
            <button
              className="flex items-center justify-center w-full p-2 bg-brand_blue text-primary_black rounded hover:opacity-80 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleActionSelect('rewrite');
              }}
            >
              <Zap size={16} className="mr-2" /> Rewrite with Praxis
            </button>
          </div>
        )}
      </div>
    </Draggable>
  );
};

export default ThoughtBubble;