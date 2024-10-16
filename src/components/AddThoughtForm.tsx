import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface AddThoughtFormProps {
  onAddThought: (content: string) => void;
}

const AddThoughtForm: React.FC<AddThoughtFormProps> = ({ onAddThought }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onAddThought(content.trim());
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter a thought..."
        className="flex-grow border border-brand_blue bg-primary_black text-brand_gray rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand_green"
      />
      <button
        type="submit"
        className="bg-brand_green text-primary_black px-6 py-2 rounded-r-md hover:bg-brand_blue focus:outline-none focus:ring-2 focus:ring-brand_green flex items-center"
      >
        <Plus size={20} className="mr-2" />
        Add
      </button>
    </form>
  );
};

export default AddThoughtForm;