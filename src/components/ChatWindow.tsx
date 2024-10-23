import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  messages: { role: string; content: string }[];
  onSubmit: (message: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  onClose,
  messages,
  onSubmit,
}) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input.trim());
      setInput("");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="left"
        className="w-[600px] sm:w-[540px] h-full flex flex-col bg-primary_bg text-brand_gray"
      >
        <SheetHeader>
          <SheetTitle className="text-brand_green">
            Chat with your thoughts
          </SheetTitle>
          <SheetDescription className="text-gray_text">
            Ask questions or discuss your thoughts
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg ${
                message.role === "user"
                  ? "bg-brand_blue text-primary_black ml-auto"
                  : "bg-brand_black text-brand_gray"
              } max-w-[80%]`}
            >
              {message.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t border-brand_blue"
        >
          <div className="flex">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow bg-primary_black text-brand_gray border-brand_blue focus:ring-brand_green"
            />
            <Button
              type="submit"
              className="ml-2 bg-brand_green text-primary_black hover:bg-brand_blue"
            >
              <Send size={20} />
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default ChatWindow;
