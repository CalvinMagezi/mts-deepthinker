import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatWindowProps {
  messages: { role: string; content: string }[];
  onSubmit: (message: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSubmit }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input.trim());
      setInput('');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg ${
              message.role === 'user'
                ? 'bg-brand_blue text-primary_black ml-auto'
                : 'bg-brand_black text-brand_gray'
            } max-w-[80%]`}
          >
            {message.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-brand_blue">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Chat with Praxis..."
            className="flex-grow bg-primary_black text-brand_gray border border-brand_blue rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand_green"
          />
          <button
            type="submit"
            className="bg-brand_green text-primary_black px-4 py-2 rounded-r-md hover:bg-brand_blue focus:outline-none focus:ring-2 focus:ring-brand_green"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;