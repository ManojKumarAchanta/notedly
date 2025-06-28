import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useCreateNoteMutation, useEnhanceNoteWithAIMutation } from "@/app/services/notesApi";
import toast from "react-hot-toast";
import { useRef } from "react";
import { Wrench } from "lucide-react";
import { SaveIcon } from "lucide-react";
import { LoaderCircle } from "lucide-react";
import { PlusCircle } from "lucide-react";
import { PlusSquareIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "./ui/button";
import SimpleTags from "./SimpleTags";
import { WandSparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { FileIcon } from "lucide-react";
import { XIcon } from "lucide-react";

function cleanModelOutput(dirtyHtml) {
    return dirtyHtml
        .replace(/```html\s*/i, "") // remove starting ```html
        .replace(/```$/, "") // remove ending ```
        .trim();
}
export default function CreateNoteForm() {
    const [createNote, { isLoading }] = useCreateNoteMutation();
    const [tags, setTags] = useState([]); // State to manage tags if needed
    const [enhanceNoteWithAI] = useEnhanceNoteWithAIMutation();
    // State to manage the content of the TinyMCE editor
    const titleRef = useRef(null);
    const editorRef = useRef(null);
    const handleEnhanceNoteWithAI = async () => {
        try {
            const res = await enhanceNoteWithAI({ note: editorRef.current.getContent() });
            // console.log(res);
            //get value of html from data getting from useEnhanceNoteWithAIQuery
            const html = res.data?.html;
            if (!html) {
                toast.error("Failed to enhance note with AI. Please try again.");
                return;
            }
            // Set the content of the TinyMCE editor to the enhanced HTML
            if (editorRef.current) {
                editorRef.current.setContent(cleanModelOutput(html));
            }
            toast.success("Note enhanced with AI successfully!");

        } catch (error) {
            toast.error("Failed to enhance note with AI. Please try again.");
            console.error("Error enhancing note with AI:", error);
        }
    };
    const navigate = useNavigate();
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

        const isContentEmpty =
            !content ||
            content.trim() === "" ||
            content.trim() === "<p><br></p>" ||
            content.trim() === "<p></p>";

        if (isContentEmpty) {
            toast.error("Please write some content for your note.");
            return;
        }

        try {
            // If files are selected, you may want to encode or extract info
            const attachments = selectedFiles?.map((file) => ({
                name: file.name,
                type: file.type,
                size: file.size,
                // Optional: Convert to base64 (not great for large files)
                // base64: await fileToBase64(file),
            }));

            const noteData = {
                content,
                title: titleRef.current.value.trim(),
                tags: tags.map((tag) => tag.trim()),
                isPinned: false,
                isArchived: false,
                color: "#ffffff",
                attachments, // send file info as JSON (not binary)
            };

            await createNote(noteData).unwrap();

            toast.success("Note saved successfully!");

            // Clear form
            editorRef.current.setContent("");
            titleRef.current.value = "";
            setSelectedFiles([]);
            navigate("/notes");
        } catch (error) {
            console.error("Error saving note:", error);
            toast.error("Failed to save note. Please try again.");
        }
    };
    const [selectedFiles, setSelectedFiles] = useState([]);

    function FileIcon(props) {
        return (
            <svg
                {...props}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            </svg>
        )
    }

    // Helper function to format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    function FileUploadSection() {
        const [selectedFiles, setSelectedFiles] = useState([]);
        const fileInputRef = useRef(null);

        const handleFileChange = (e) => {
            const files = Array.from(e.target.files || []);
            setSelectedFiles(files);
        };

        const removeFile = (index) => {
            const newFiles = selectedFiles.filter((_, i) => i !== index);
            setSelectedFiles(newFiles);
        };

        return (
            <div className="relative mb-4">
                {/* In Development Overlay */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-[12px] z-10 rounded-lg flex items-center justify-center">
                    <div className="bg-transparent bg-yellow-40 border-2 border-yellow-300 rounded-lg p-6 shadow-lg max-w-md text-center">
                        <Wrench className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Feature In Development</h3>
                        <p className="text-sm text-yellow-700">
                            File upload functionality is currently being developed and will be available soon.
                        </p>
                    </div>
                </div>

                {/* Faded Content */}
                <div className="opacity-30 pointer-events-none">
                    <Card className="mb-4">
                        <CardHeader>
                            <CardTitle className="text-lg">Attachments (Optional)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/*,application/pdf,video/*,audio/*,.doc,.docx,.txt"
                                onChange={handleFileChange}
                            />

                            {selectedFiles.length > 0 && (
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">
                                        Selected Files ({selectedFiles.length})
                                    </Label>
                                    <div className="space-y-2 max-h-32 overflow-y-auto">
                                        {selectedFiles.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                                    <FileIcon className="w-4 h-4" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium truncate">{file.name}</p>
                                                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeFile(index)}
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-[75%_25%] min-h-screen bg-background align-center place-content-center text-foreground">
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
                    <div className="flex items-center gap-2">
                        {/* //magic AI button */}
                        <Button
                            onClick={handleEnhanceNoteWithAI}
                            className="px-3 py-2 sm:px-4 sm:py-2 rounded text-sm sm:text-base transition-colors duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-1 sm:gap-2">
                                    <LoaderCircle className="animate-spin w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="hidden sm:inline">Enhancing...</span>
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 sm:gap-2">
                                    <WandSparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="hidden sm:inline">Enhance with AI</span>
                                    <span className="sm:hidden">AI</span>
                                </span>
                            )}
                        </Button>
                        <Button
                            onClick={handleCreateNote}
                            className="px-3 py-2 sm:px-4 sm:py-2 rounded text-sm sm:text-base transition-colors duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
                </div>
                <div className="mb-4 flex items-center w-full">
                    <SimpleTags tags={tags} setTags={setTags} />
                </div>

                <div className="relative w-full">
                    {/* Create Note Button - Responsive positioning */}


                    {/* Editor Container */}
                    <div className="w-full">
                        {/* if is enhancing set isenhanicng */}
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
                            placeholder="Write your note here..."
                        />
                    </div>
                </div>
            </div>
            <div>
                <FileUploadSection />
            </div>
        </div>
    );
}

