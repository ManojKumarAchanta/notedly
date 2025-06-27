import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useCreateNoteMutation } from "@/app/services/notesApi";
import toast from "react-hot-toast";
import { useRef } from "react";
import { SaveIcon } from "lucide-react";
import { LoaderCircle } from "lucide-react";
import { PlusCircle } from "lucide-react";
import { PlusSquareIcon } from "lucide-react";
import { setActiveView } from "@/app/features/uiSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { Button } from "./ui/button";
import SimpleTags from "./SimpleTags";

export default function CreateNoteForm() {
    const [createNote, { isLoading }] = useCreateNoteMutation();
    const [tags, setTags] = useState([]); // State to manage tags if needed

    // State to manage the content of the TinyMCE editor
    const titleRef = useRef(null);
    const editorRef = useRef(null);
    const dispatch = useDispatch();
    const handleCreateNote = async () => {
        // Validate title
        if (!titleRef.current?.value?.trim()) {
            toast.error("Please enter a title for your note.");
            return;
        }

        // Validate editor content
        if (!editorRef.current) {
            console.error("Editor reference is not set.");
            toast.error("Editor is not initialized. Please try again.");
            return;
        }

        const content = editorRef.current.getContent();

        // Check if content is empty (TinyMCE returns '<p><br></p>' for empty content)
        const isContentEmpty = !content || content.trim() === '' || content.trim() === '<p><br></p>' || content.trim() === '<p></p>';

        if (isContentEmpty) {
            toast.error("Please write some content for your note.");
            return;
        }

        try {
            console.log("Creating note with:", { content, title: titleRef.current.value });

            await createNote({
                content,
                title: titleRef.current.value.trim(),
                tags: tags.map(tag => tag.trim()), // Ensure tags are trimmed
                isPinned: false, // Default value, can be changed later
                isArchived: false, // Default value, can be changed later
                color: "#ffffff", // Default color, can be changed later
            }).unwrap();

            toast.success("Note saved successfully!");

            // Clear the form after successful save
            editorRef.current.setContent("");
            titleRef.current.value = "";
            dispatch(setActiveView("list")); // Navigate back to the list view after saving

        } catch (error) {
            console.error("Error saving note:", error);
            toast.error("Failed to save note. Please try again.");
        }
    };

    return (
        <div className="w-full mx-auto py-6 md:px-6">
            {/* Header content above editor */}
            <header className="flex justify-between flex-col items-start mb-4">
                <h1 className="text-xl md:text-4xl font-bold mb-2">
                    Unleash your creativity
                </h1>
                <p className="text-sm md:text-lg max-w- leading-relaxed">
                    Save notes quickly, brainstorm thoughts, and thunder ideas here — <br />
                    meaningful and attractive statements to boost your creativity.
                </p>
            </header>

            {/* Title Input */}
            <div className="mb-4 flex items-center  w-full justify-between ">
                <input
                    type="text"
                    ref={titleRef}
                    placeholder="Untitled Note"
                    required
                    className=" w-1/4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                    onClick={handleCreateNote}
                    className="px-3 py-2 sm:px-4 sm:py-2 rounded text-sm sm:text-base hover:bg-gray-900 transition-colors duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span className="flex items-center gap-1 sm:gap-2">
                            <LoaderCircle className="animate-spin w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline">Creating...</span>
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 sm:gap-2">
                            <span className="hidden sm:inline">Create</span>
                            <span className="sm:hidden">+</span>
                            <PlusSquareIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </span>
                    )}
                </Button>
            </div>
            <div className="mb-4 flex items-center w-full">
                <SimpleTags tags={tags} setTags={setTags} />
            </div>

            <div className="relative w-full">
                {/* Create Note Button - Responsive positioning */}


                {/* Editor Container */}
                <div className="w-full">
                    <Editor
                        onInit={(evt, editor) => (editorRef.current = editor)}
                        className="w-full h-[500px] sm:h-[600px] md:h-[720px] border border-gray-300 rounded"
                        apiKey="1dwskg2xqhe1uvn9k3g9ub5wc846os2qz5kidgkj6xbzmiwm"
                        init={{
                            height: window.innerWidth < 640 ? 500 : window.innerWidth < 768 ? 600 : 720,
                            toolbar: window.innerWidth < 640
                                ? "undo redo | bold italic | link | numlist bullist"
                                : "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                            promotion: false,
                            branding: false,
                            onboarding: false,
                        }}
                        initialValue="Write your note here..."
                    />
                </div>
            </div>
        </div>
    );
}