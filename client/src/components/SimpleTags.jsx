import React, { useState } from 'react';
import { X } from 'lucide-react';

const SimpleTags = ({ tags, setTags }) => {
    const [inputValue, setInputValue] = useState('');

    const addTag = (tagToAdd) => {
        const trimmedTag = tagToAdd.trim();
        if (trimmedTag && !tags.includes(trimmedTag)) {
            setTags(prev => [...prev, trimmedTag]);
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(prev => prev.filter(tag => tag !== tagToRemove));
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);

        // Handle comma-separated input
        if (value.includes(',')) {
            const newTags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
            newTags.forEach(tag => addTag(tag));
            setInputValue('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            addTag(inputValue);
            setInputValue('');
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            removeTag(tags[tags.length - 1]);
        }
    };

    return (
        <div className="w-full max-w-2xl space-y-4">
            <h2 className="text-2xl font-bold ">Add Tags for your Note</h2>

            {/* Main Input Container */}
            <div className="min-h-[42px] w-[2/12] border border-gray-300 rounded-md bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                <div className="flex flex-wrap gap-1 p-2">
                    {/* Render existing tags */}
                    {tags.map((tag, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md border border-blue-200"
                        >
                            {tag}
                            <button
                                onClick={() => removeTag(tag)}
                                className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                                type="button"
                            >
                                <X size={12} />
                            </button>
                        </span>
                    ))}

                    {/* Input field */}
                    <div className="flex-1 min-w-[60px]">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder={tags.length === 0 ? "Add tags (comma separated or press Enter)..." : "Add more tags..."}
                            className="w-full border-none outline-none text-sm text-black placeholder-gray-400"
                        />
                    </div>
                </div>
            </div>

            {/* Display selected tags count */}
            {tags.length > 0 && (
                <div className="text-sm text-gray-600">
                    {tags.length} tag{tags.length === 1 ? '' : 's'} selected
                </div>
            )}
        </div>
    );
};

export default SimpleTags;