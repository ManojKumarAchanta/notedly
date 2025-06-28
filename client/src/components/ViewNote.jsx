import React from 'react';
import { Calendar, User, Tag, Eye, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/app/features/authSlice';
import { useParams } from 'react-router-dom';
import { useGetNoteQuery } from '@/app/services/notesApi';
import SimpleBreadcrumb from './SimpleBreadcrumb';

export default function NoteViewer() {
    const user = useSelector(selectCurrentUser);
    const { id: noteId } = useParams();
    console.log(noteId)
    const { data, error, isLoading: isFetching } = useGetNoteQuery(noteId, {
        skip: !noteId
    });
    console.log(data)

    if (error) {
        return <div className="text-red-500 text-center">Error loading note: {error.message}</div>;
    }
    if (isFetching) {
        return <div className="text-gray-500 text-center">Loading note...</div>;
    }

    const noteData = {
        _id: data?._id || noteId,
        title: data?.title || "Sample Note Title",
        content: data?.content || "<p>This is a sample note content with <strong>HTML</strong> formatting.</p>",
        tags: data?.tags || ["example", "sample", "note"],
        color: data?.color || "#ffffff",
        createdAt: data?.createdAt || "2024-01-15T12:00:00Z",
        updatedAt: data?.updatedAt || "2024-01-16T12:00:00Z",
        isPinned: data?.isPinned || false,
        isArchived: data?.isArchived || false,
        author: user.username || 'User'
    };

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

    // Calculate reading time
    const calculateReadingTime = (content) => {
        const wordsPerMinute = 200;
        const textContent = content.replace(/<[^>]*>/g, ''); // Strip HTML tags
        const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length;
        const readingTime = Math.ceil(wordCount / wordsPerMinute);
        return readingTime === 1 ? '1 min' : `${readingTime} mins`;
    };

    return (
        <div className='w-full h-full'>
            <SimpleBreadcrumb />
            <div className="max-w-7xl mx-auto p-6 min-h-screen">
                {/* Header Section */}
                <div className="mb-8">
                    <Card className="border shadow-sm">
                        <CardHeader className="pb-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 rounded-lg border">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {noteData.isPinned && (
                                                <Badge variant="secondary">
                                                    📌 Pinned
                                                </Badge>
                                            )}
                                            {noteData.isArchived && (
                                                <Badge variant="outline">
                                                    📁 Archived
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <CardTitle className="text-3xl md:text-4xl font-bold leading-tight">
                                        {noteData.title}
                                    </CardTitle>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <Card className="shadow-sm border">
                            <CardContent className="p-8">
                                <div
                                    className="prose prose-lg max-w-none 
    prose-headings:font-bold prose-headings:text-foreground
    prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8
    prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-6
    prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-5
    prose-h4:text-lg prose-h4:mb-2 prose-h4:mt-4
    prose-p:text-foreground prose-p:leading-relaxed prose-p:mb-4
    prose-strong:text-foreground prose-strong:font-semibold
    prose-em:text-foreground prose-em:italic
    prose-ul:text-foreground prose-ul:mb-4 prose-ul:pl-6
    prose-ol:text-foreground prose-ol:mb-4 prose-ol:pl-6
    prose-li:mb-1 prose-li:leading-relaxed
    prose-blockquote:border-l-4 prose-blockquote:border-border 
    prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:italic
    prose-blockquote:text-muted-foreground prose-blockquote:bg-muted
    prose-blockquote:rounded-r-md prose-blockquote:my-4
    prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
    prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-auto
    prose-a:text-primary prose-a:underline prose-a:decoration-primary/30
    prose-a:hover:decoration-primary prose-a:transition-colors
    prose-table:w-full prose-table:border-collapse prose-table:border prose-table:border-border
    prose-th:border prose-th:border-border prose-th:bg-muted prose-th:p-2 prose-th:text-left prose-th:font-semibold
    prose-td:border prose-td:border-border prose-td:p-2
    prose-hr:border-border prose-hr:my-8
    prose-img:rounded-lg prose-img:shadow-sm prose-img:my-6
    first:prose-h1:mt-0 first:prose-h2:mt-0 first:prose-h3:mt-0 first:prose-p:mt-0"
                                    dangerouslySetInnerHTML={{ __html: noteData.content }}
                                />

                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Author & Metadata */}
                        <Card className="shadow-sm border">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <User className="w-5 h-5" />
                                    Author
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-10 h-10">
                                        <AvatarFallback className="font-semibold">
                                            {user.username?.split(' ').map(n => n[0]).join('') || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{user?.username || 'Unknown'}</p>
                                        <p className="text-sm text-muted-foreground">@{user?.username || 'user'}</p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <div>
                                            <p className="font-medium">Created</p>
                                            <p className="text-muted-foreground">{formatDate(noteData.createdAt)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <div>
                                            <p className="font-medium">Updated</p>
                                            <p className="text-muted-foreground">{formatDate(noteData.updatedAt)}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tags */}
                        {noteData.tags && noteData.tags.length > 0 && (
                            <Card className="shadow-sm border">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Tag className="w-5 h-5" />
                                        Tags
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {noteData.tags.map((tag, index) => (
                                            <Badge
                                                key={index}
                                                variant="secondary"
                                                className="hover:bg-secondary/80 transition-colors"
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
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