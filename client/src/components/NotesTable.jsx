import React, { useState } from "react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./ui/alert-dialog"

import { Button } from "./ui/button";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "./ui/table";
import { useNavigate } from "react-router-dom";
import { Badge } from "./ui/badge";
import {
    Pin,
    PinOff,
    Archive,
    ArchiveX,
    Trash2,
    Dot,
    Search,
    Edit
} from "lucide-react";
import {
    useDeleteNoteMutation,
    useGetNotesQuery,
    useTogglePinMutation,
    useToggleArchiveMutation,
    useDeleteManyNotesMutation
} from "../app/services/notesApi";
import { useEffect } from "react";
import { PlusIcon } from "lucide-react";
import toast from "react-hot-toast";

export default function NotesTable() {
    const [search, setSearch] = useState("");
    const [selectedNotes, setSelectedNotes] = useState(new Set());
    const navigate = useNavigate();

    const {
        data: apiData,
        isLoading,
        error,
        refetch
    } = useGetNotesQuery();

    // RTK Query Mutations
    const [deleteNote] = useDeleteNoteMutation();
    const [deleteManyNotes] = useDeleteManyNotesMutation();
    const [togglePin] = useTogglePinMutation();
    const [toggleArchive] = useToggleArchiveMutation();

    useEffect(() => {
        if (error) {
            console.error('API Error:', error);
        }
    }, [error]);

    // Sort and organize notes: Pinned first, then regular, then archived
    const sortedNotes = React.useMemo(() => {
        if (!apiData) return [];

        const notes = [...apiData];

        return notes.sort((a, b) => {
            // First priority: Pinned notes come first
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;

            // Second priority: Non-archived before archived
            if (!a.isArchived && b.isArchived) return -1;
            if (a.isArchived && !b.isArchived) return 1;

            // Third priority: Sort by creation date (newest first)
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
    }, [apiData]);

    const filteredNotes = sortedNotes.filter(note =>
        note.title?.toLowerCase().includes(search.toLowerCase()) ||
        note.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
    );

    // Enhanced togglePin function with proper RTK Query mutation
    const handleTogglePin = async (note) => {
        try {
            const result = await togglePin(note._id).unwrap();
            console.log(result)
            toast.success(result.isPinned ? "Note pinned!" : "Note unpinned!");
        } catch (error) {
            console.error('Pin toggle error:', error);
            toast.error("Failed to update pin status. Please try again.");
        }
    };

    // Enhanced toggleArchive function with proper RTK Query mutation
    const handleToggleArchive = async (note) => {
        try {
            const result = await toggleArchive(note._id).unwrap();
            toast.success(result.isArchived ? "Note archived!" : "Note unarchived!");
        } catch (error) {
            console.error('Archive toggle error:', error);
            toast.error("Failed to update archive status. Please try again.");
        }
    };

    const handleDelete = async (noteId) => {
        try {
            await deleteNote(noteId).unwrap();
            toast.success("Note deleted successfully!");

            // Update local selection state
            setSelectedNotes(prev => {
                const newSet = new Set(prev);
                newSet.delete(noteId);
                return newSet;
            });
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Failed to delete note. Please try again.");
        }
    };

    // Bulk delete functionality
    const handleBulkDelete = async () => {
        if (selectedNotes.size === 0) return;

        const noteIds = Array.from(selectedNotes);

        try {
            await deleteManyNotes(noteIds).unwrap();
            toast.success(`${noteIds.length} notes deleted successfully!`);
            setSelectedNotes(new Set());
        } catch (error) {
            console.error("Bulk delete error:", error);
            toast.error("Failed to delete notes. Please try again.");
        }
    };

    // Bulk pin functionality
    const handleBulkPin = async (shouldPin) => {
        if (selectedNotes.size === 0) return;

        const noteIds = Array.from(selectedNotes);
        const failedUpdates = [];

        try {
            for (const noteId of noteIds) {
                try {
                    const currentNote = sortedNotes.find(n => n._id === noteId);
                    // Only toggle if the current state is different from desired state
                    if ((shouldPin && !currentNote?.isPinned) || (!shouldPin && currentNote?.isPinned)) {
                        await togglePin(noteId).unwrap();
                    }
                } catch (error) {
                    failedUpdates.push(noteId);
                    console.error(`Failed to pin/unpin note ${noteId}:`, error);
                }
            }

            // Show appropriate toast message
            if (failedUpdates.length === 0) {
                toast.success(`${noteIds.length} notes ${shouldPin ? 'pinned' : 'unpinned'} successfully!`);
            } else {
                toast.error(`Failed to update ${failedUpdates.length} notes. Please try again.`);
            }

        } catch (error) {
            console.error("Bulk pin error:", error);
            toast.error("Failed to update notes. Please try again.");
        }
    };

    // Bulk archive functionality
    const handleBulkArchive = async (shouldArchive) => {
        if (selectedNotes.size === 0) return;

        const noteIds = Array.from(selectedNotes);
        const failedUpdates = [];

        try {
            for (const noteId of noteIds) {
                try {
                    const currentNote = sortedNotes.find(n => n._id === noteId);
                    // Only toggle if the current state is different from desired state
                    if ((shouldArchive && !currentNote?.isArchived) || (!shouldArchive && currentNote?.isArchived)) {
                        await toggleArchive(noteId).unwrap();
                    }
                } catch (error) {
                    failedUpdates.push(noteId);
                    console.error(`Failed to archive/unarchive note ${noteId}:`, error);
                }
            }

            // Show appropriate toast message
            if (failedUpdates.length === 0) {
                toast.success(`${noteIds.length} notes ${shouldArchive ? 'archived' : 'unarchived'} successfully!`);
            } else {
                toast.error(`Failed to update ${failedUpdates.length} notes. Please try again.`);
            }

        } catch (error) {
            console.error("Bulk archive error:", error);
            toast.error("Failed to update notes. Please try again.");
        }
    };

    const handleEdit = (note) => {
        navigate(`/notes/edit/${note._id}`);
    };

    const toggleSelectNote = (noteId) => {
        setSelectedNotes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(noteId)) {
                newSet.delete(noteId);
            } else {
                newSet.add(noteId);
            }
            return newSet;
        });
    };

    const toggleSelectAll = () => {
        if (selectedNotes.size === filteredNotes.length) {
            setSelectedNotes(new Set());
        } else {
            setSelectedNotes(new Set(filteredNotes.map(note => note._id)));
        }
    };

    if (isLoading) {
        return (
            <div className="w-full px-4 sm:px-6 py-8">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading notes...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full px-4 sm:px-6 py-8">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <p className="text-red-500 mb-4">Error loading notes</p>
                        <p className="text-sm text-muted-foreground mb-4">
                            {error.message || 'An error occurred while fetching notes'}
                        </p>
                        <Button onClick={() => refetch()} variant="outline">
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full px-4 sm:px-6 py-6 sm:py-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight">Your Notes</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage and organize your notes
                    </p>
                </div>

                {/* Search Input */}
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search notes and tags..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    />
                </div>
            </div>

            {/* Bulk Actions Bar */}
            {selectedNotes.size > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-muted/50 rounded-lg border">
                    <span className="text-sm font-medium">
                        {selectedNotes.size} selected
                    </span>
                    <div className="flex items-center gap-1 ml-auto">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBulkPin(true)}
                        >
                            <Pin className="h-4 w-4 mr-1" />
                            Pin All
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBulkPin(false)}
                        >
                            <PinOff className="h-4 w-4 mr-1" />
                            Unpin All
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBulkArchive(true)}
                        >
                            <Archive className="h-4 w-4 mr-1" />
                            Archive All
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBulkArchive(false)}
                        >
                            <ArchiveX className="h-4 w-4 mr-1" />
                            Unarchive All
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete All
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Selected Notes</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete {selectedNotes.size} selected notes? This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleBulkDelete}
                                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                                    >
                                        Delete All
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedNotes(new Set())}
                        >
                            Clear
                        </Button>
                    </div>
                </div>
            )}

            {/* Stats Bar */}
            {filteredNotes.length > 0 && (
                <div className="flex justify-between flex-wrap items-center gap-4 mb-4 text-sm text-muted-foreground">
                    <div>
                        <span>{filteredNotes.length} notes</span>
                        <span> • </span>
                        <span>{filteredNotes.filter(n => n.isPinned).length} pinned</span>
                        <span> • </span>
                        <span>{filteredNotes.filter(n => n.isArchived).length} archived</span>
                        {selectedNotes.size > 0 && (
                            <>
                                <span> • </span>
                                <span className="font-medium">{selectedNotes.size} selected</span>
                            </>
                        )}
                    </div>
                    <div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate("/notes/create")}
                        >
                            Create <PlusIcon className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Table Container */}
            <div className="rounded-lg border bg-card">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-b h-10">
                                <TableHead className="w-10 pl-3 py-2">
                                    <input
                                        type="checkbox"
                                        checked={filteredNotes.length > 0 && selectedNotes.size === filteredNotes.length}
                                        onChange={toggleSelectAll}
                                        className="rounded border-input w-3.5 h-3.5"
                                    />
                                </TableHead>
                                <TableHead className="min-w-[200px] font-medium py-2 text-sm">Title</TableHead>
                                <TableHead className="min-w-[120px] font-medium hidden sm:table-cell py-2 text-sm">Tags</TableHead>
                                <TableHead className="w-16 font-medium text-center hidden md:table-cell py-2 text-sm">Pin</TableHead>
                                <TableHead className="w-20 font-medium text-center hidden lg:table-cell py-2 text-sm">Archive</TableHead>
                                <TableHead className="w-14 font-medium text-center hidden xl:table-cell py-2 text-sm">Color</TableHead>
                                <TableHead className="w-20 font-medium hidden lg:table-cell py-2 text-sm">Created</TableHead>
                                <TableHead className="w-28 font-medium text-right pr-3 py-2 text-sm">Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {filteredNotes.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-20">
                                        <div className="flex flex-col items-center justify-center text-center">
                                            <div className="text-muted-foreground mb-2 text-sm">
                                                {search ? "No notes found matching your search." : "No notes found."}
                                            </div>
                                            {search && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setSearch("")}
                                                >
                                                    Clear search
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}

                            {filteredNotes.map((note) => (
                                <TableRow
                                    key={note._id}
                                    className={`hover:bg-muted/50 transition-colors h-12 ${selectedNotes.has(note._id) ? 'bg-muted/30' : ''
                                        } ${note.isPinned ? 'bg-blue-50/30 dark:bg-blue-950/20' : ''
                                        } ${note.isArchived ? 'opacity-60' : ''
                                        }`}
                                >
                                    {/* Checkbox */}
                                    <TableCell className="pl-3 py-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedNotes.has(note._id)}
                                            onChange={() => toggleSelectNote(note._id)}
                                            className="rounded border-input w-3.5 h-3.5"
                                        />
                                    </TableCell>

                                    {/* Title */}
                                    <TableCell className="font-medium py-2">
                                        <div className="flex items-center gap-2">
                                            {note.isPinned && (
                                                <Pin className="h-3 w-3 text-blue-500 fill-current flex-shrink-0" />
                                            )}
                                            <span className={`truncate text-sm ${note.isArchived ? 'line-through text-muted-foreground' : ''}`}>
                                                {note.title}
                                            </span>
                                            {note.isArchived && (
                                                <Archive className="h-3 w-3 text-muted-foreground ml-auto flex-shrink-0" />
                                            )}
                                        </div>

                                        {/* Mobile Tags - Show on small screens */}
                                        <div className="flex flex-wrap gap-1 mt-1 sm:hidden">
                                            {note.tags?.slice(0, 2).map((tag, i) => (
                                                <Badge key={i} variant="outline" className="text-xs px-1.5 py-1.5 h-8">
                                                    {tag}
                                                </Badge>
                                            ))}
                                            {note.tags?.length > 2 && (
                                                <Badge variant="outline" className="text-xs px-1.5 py-1.5 h-8">
                                                    +{note.tags.length - 2}
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>

                                    {/* Tags - Hidden on mobile */}
                                    <TableCell className="hidden sm:table-cell py-2">
                                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                                            {note.tags?.slice(0, 3).map((tag, i) => (
                                                <Badge key={i} variant="outline" className="text-xs px-1.5 py-2 h-5">
                                                    {tag}
                                                </Badge>
                                            ))}
                                            {note.tags?.length > 3 && (
                                                <Badge variant="outline" className="text-xs px-1.5 py-2 h-5">
                                                    +{note.tags.length - 3}
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>

                                    {/* Pin Status - Hidden on mobile/tablet */}
                                    <TableCell className="text-center hidden md:table-cell py-2">
                                        <div className="flex justify-center">
                                            {note.isPinned ? (
                                                <Pin className="h-3.5 w-3.5 text-blue-500 fill-current" />
                                            ) : (
                                                <span className="text-muted-foreground text-xs">—</span>
                                            )}
                                        </div>
                                    </TableCell>

                                    {/* Archive Status - Hidden on smaller screens */}
                                    <TableCell className="text-center hidden lg:table-cell py-2">
                                        <div className="flex justify-center">
                                            {note.isArchived ? (
                                                <Archive className="h-3.5 w-3.5 text-muted-foreground" />
                                            ) : (
                                                <span className="text-muted-foreground text-xs">—</span>
                                            )}
                                        </div>
                                    </TableCell>

                                    {/* Color - Hidden on smaller screens */}
                                    <TableCell className="text-center hidden xl:table-cell py-2">
                                        <div className="flex justify-center">
                                            <Dot className="h-14 w-14" style={{ color: note.color }} />
                                        </div>
                                    </TableCell>

                                    {/* Created Date - Hidden on smaller screens */}
                                    <TableCell className="text-xs text-muted-foreground hidden lg:table-cell py-2">
                                        {note.createdAt ? new Date(note.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            timeZone: 'UTC',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true,
                                        }) : '—'}
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell className="text-right pr-3 py-2">
                                        <div className="flex items-center justify-end gap-0.5">
                                            {/* Always show on larger screens */}
                                            <div className="hidden md:flex items-center gap-0.5">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleTogglePin(note)}
                                                    className="h-7 w-7 p-0 hover:bg-muted"
                                                    title={note.isPinned ? "Unpin note" : "Pin note"}
                                                >
                                                    {note.isPinned ? (
                                                        <PinOff className="h-3.5 w-3.5" />
                                                    ) : (
                                                        <Pin className="h-3.5 w-3.5" />
                                                    )}
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleToggleArchive(note)}
                                                    className="h-7 w-7 p-0 hover:bg-muted"
                                                    title={note.isArchived ? "Unarchive note" : "Archive note"}
                                                >
                                                    {note.isArchived ? (
                                                        <ArchiveX className="h-3.5 w-3.5" />
                                                    ) : (
                                                        <Archive className="h-3.5 w-3.5" />
                                                    )}
                                                </Button>
                                            </div>

                                            {/* Edit Button */}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEdit(note)}
                                                className="h-7 w-7 p-0 hover:bg-muted"
                                                title="Edit note"
                                            >
                                                <Edit className="h-3.5 w-3.5" />
                                            </Button>

                                            {/* Delete Button with AlertDialog */}
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 w-7 p-0 hover:bg-muted"
                                                        title="Delete note"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5 text-red-500 hover:text-red-600 transition-colors" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete Note</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to delete "{note.title}"? This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(note._id)}
                                                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>

                                            {/* Mobile actions - compact view */}
                                            <div className="md:hidden flex items-center gap-0.5 ml-0.5">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleTogglePin(note)}
                                                    className="h-7 w-7 p-0 hover:bg-muted"
                                                >
                                                    {note.isPinned ? (
                                                        <PinOff className="h-3.5 w-3.5" />
                                                    ) : (
                                                        <Pin className="h-3.5 w-3.5" />
                                                    )}
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleToggleArchive(note)}
                                                    className="h-7 w-7 p-0 hover:bg-muted"
                                                >
                                                    {note.isArchived ? (
                                                        <ArchiveX className="h-3.5 w-3.5" />
                                                    ) : (
                                                        <Archive className="h-3.5 w-3.5" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Footer */}
            {filteredNotes.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4 text-sm text-muted-foreground">
                    <div>
                        Showing {filteredNotes.length} of {sortedNotes.length} notes
                    </div>
                    {selectedNotes.size > 0 && (
                        <div className="flex items-center gap-2">
                            <span>{selectedNotes.size} selected</span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedNotes(new Set())}
                            >
                                Clear selection
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}