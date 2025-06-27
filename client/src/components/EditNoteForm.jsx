import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useGetNoteQuery, useUpdateNoteMutation } from "@/app/services/notesApi";
import toast from "react-hot-toast";
import { useRef, useEffect } from "react";
import { SaveIcon, CalendarIcon, UserIcon, TagIcon, XIcon, PlusIcon } from "lucide-react";
import { LoaderCircle } from "lucide-react";
import { setActiveView } from "@/app/features/uiSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function EditNoteForm() {
    // Extract note ID from URL path (e.g., /notes/685e1f1247dd5453e002dd28)
    const noteId = window.location.pathname.split('/').pop();

    const [updateNote, { isLoading: isUpdating }] = useUpdateNoteMutation();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState("");
    const [color, setColor] = useState("#ffffff");
    const editorRef = useRef(null);
    const dispatch = useDispatch();

    // Fetch note data when component mounts
    const { data: noteData, error, isLoading: isFetching } = useGetNoteQuery(noteId, {
        skip: !noteId
    });

    // Load note data into form when noteData is available
    useEffect(() => {
        if (noteData) {
            setTitle(noteData.title || "");
            setContent(noteData.content || "");
            setTags(noteData.tags || []);
            setColor(noteData.color || "#ffffff");
        }
    }, [noteData]);

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Add new tag
    const handleAddTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            setTags([...tags, newTag.trim()]);
            setNewTag("");
        }
    };

    // Remove tag
    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    // Handle Enter key in tag input
    const handleTagInputKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleUpdateNote = async () => {
        try {
            if (!noteId) {
                console.error("Note ID is not provided.");
                toast.error("Note ID is required to update a note.");
                return;
            }

            // Check if content is empty
            const isContentEmpty = !content ||
                content.trim() === '' ||
                content.trim() === '<p><br></p>' ||
                content.trim() === '<p></p>';

            if (isContentEmpty) {
                toast.error("Please write some content for your note.");
                return;
            }

            if (!title.trim()) {
                toast.error("Please provide a title for your note.");
                return;
            }

            console.log("Updating note with:", { id: noteId, title, content, tags, color });

            await updateNote({
                id: noteId,
                title: title.trim(),
                content,
                tags,
                color,
            }).unwrap();

            toast.success("Note updated successfully!");
            dispatch(setActiveView("list"));

        } catch (error) {
            console.error("Error updating note:", error);
            toast.error("Failed to update note. Please try again.");
        }
    };

    // Show loading state while fetching note data
    if (isFetching) {
        return (
            <div className="w-full mx-auto py-4 md:px-12 flex justify-center items-center min-h-[400px]">
                <div className="flex items-center gap-2">
                    <LoaderCircle className="animate-spin w-6 h-6" />
                    <span>Loading note...</span>
                </div>
            </div>
        );
    }

    // Show error state if note fetch failed
    if (error) {
        return (
            <div className="w-full mx-auto py-4 md:px-12">
                <div className="text-center text-red-600">
                    <h2 className="text-xl font-bold mb-2">Error Loading Note</h2>
                    <p>Failed to load the note. Please try again.</p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="mt-4"
                        variant="outline"
                    >
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    // Show message if note ID is missing
    if (!noteId) {
        return (
            <div className="w-full mx-auto py-4 md:px-12">
                <div className="text-center text-red-600">
                    <h2 className="text-xl font-bold mb-2">Invalid Note ID</h2>
                    <p>No note ID provided in the URL.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full mx-auto py-4 md:px-6 max-w-6xl">
            {/* Header with metadata */}
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl md:text-4xl font-bold">
                                Edit Your Note
                            </CardTitle>
                            <p className="text-sm md:text-lg text-muted-foreground mt-2">
                                Update your thoughts and ideas — refine your creativity and make it even better.
                            </p>
                        </div>

                        {/* Metadata */}
                        {noteData && (
                            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <UserIcon className="w-4 h-4" />
                                    <span>Author: {noteData.userId}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4" />
                                    <span>Created: {formatDate(noteData.createdAt)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4" />
                                    <span>Updated: {formatDate(noteData.updatedAt)}</span>
                                </div>
                                {noteData.isPinned && (
                                    <Badge variant="secondary" className="w-fit">
                                        📌 Pinned
                                    </Badge>
                                )}
                                {noteData.isArchived && (
                                    <Badge variant="outline" className="w-fit">
                                        📁 Archived
                                    </Badge>
                                )}
                            </div>
                        )}
                    </div>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Content Area */}
                <div className="lg:col-span-3">
                    {/* Title Input */}
                    <div className="mb-4">
                        <Input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter note title..."
                            className="text-lg font-semibold"
                            required
                        />
                    </div>

                    {/* Editor Container */}
                    <div className="relative w-full">
                        <Button
                            onClick={handleUpdateNote}
                            className="absolute z-50 right-2 top-2 sm:right-4 sm:top-4"
                            disabled={isUpdating}
                            size="sm"
                        >
                            {isUpdating ? (
                                <>
                                    <LoaderCircle className="animate-spin w-4 h-4 mr-2" />
                                    <span className="hidden sm:inline">Updating...</span>
                                </>
                            ) : (
                                <>
                                    <span className="hidden sm:inline mr-2">Update Note</span>
                                    <SaveIcon className="w-4 h-4" />
                                </>
                            )}
                        </Button>

                        <div className="w-full">
                            <Editor
                                value={content}
                                onEditorChange={(newContent) => setContent(newContent)}
                                className="w-full min-h-[500px] border rounded-lg"
                                apiKey="1dwskg2xqhe1uvn9k3g9ub5wc846os2qz5kidgkj6xbzmiwm"
                                init={{
                                    height: window.innerWidth < 640 ? 500 : window.innerWidth < 768 ? 600 : 720,
                                    toolbar: window.innerWidth < 640
                                        ? "undo redo | bold italic | link | numlist bullist"
                                        : "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                                    promotion: false,
                                    branding: false,
                                    onboarding: false,
                                    skin: 'oxide',
                                    content_css: 'default',
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="space-y-6">
                        {/* Tags Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <TagIcon className="w-5 h-5" />
                                    Tags
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Add Tag Input */}
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        onKeyPress={handleTagInputKeyPress}
                                        placeholder="Add a tag..."
                                        className="flex-1"
                                    />
                                    <Button
                                        onClick={handleAddTag}
                                        size="sm"
                                        variant="outline"
                                        disabled={!newTag.trim()}
                                    >
                                        <PlusIcon className="w-4 h-4" />
                                    </Button>
                                </div>

                                {/* Existing Tags */}
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag, index) => (
                                        <Badge
                                            key={index}
                                            variant="secondary"
                                            className="flex items-center gap-1 px-2 py-1"
                                        >
                                            <span>{tag}</span>
                                            <Button
                                                onClick={() => handleRemoveTag(tag)}
                                                variant="ghost"
                                                size="sm"
                                                className="h-auto p-0 ml-1"
                                            >
                                                <XIcon className="w-3 h-3" />
                                            </Button>
                                        </Badge>
                                    ))}
                                </div>

                                {tags.length === 0 && (
                                    <p className="text-sm text-muted-foreground">
                                        No tags added yet. Add some tags to organize your note!
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Color Picker */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Note Color</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {['#ffffff', '#fef3c7', '#ddd6fe', '#fce7f3', '#d1fae5', '#fecaca', '#fed7aa'].map((colorOption) => (
                                        <button
                                            key={colorOption}
                                            onClick={() => setColor(colorOption)}
                                            className={`w-8 h-8 rounded-full border-2 ${color === colorOption ? 'border-gray-800' : 'border-gray-300'
                                                }`}
                                            style={{ backgroundColor: colorOption }}
                                        />
                                    ))}
                                </div>
                                <Input
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="mt-2 w-full h-10"
                                />
                            </CardContent>
                        </Card>

                        {/* Note Stats */}
                        {noteData && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Note Statistics</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Characters:</span>
                                        <span>{content.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Words:</span>
                                        <span>{content.split(/\s+/).filter(word => word.length > 0).length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tags:</span>
                                        <span>{tags.length}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between">
                                        <span>Note ID:</span>
                                        <span className="text-xs font-mono">{noteData._id}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}