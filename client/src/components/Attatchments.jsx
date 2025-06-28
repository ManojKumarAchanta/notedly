import React, { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Loader2, Image, Eye, Download, Trash2, X, Wrench, Music, Video } from "lucide-react"
import { useRef } from "react"
import { FileText } from "lucide-react"

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

// Helper function to get file icon based on mime type
const getFileIcon = (mimeType) => {
    if (mimeType?.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (mimeType?.startsWith('video/')) return <Video className="w-5 h-5" />;
    if (mimeType?.startsWith('audio/')) return <Music className="w-5 h-5" />;
    if (mimeType?.includes('pdf')) return <FileText className="w-5 h-5" />;
    return <FileIcon className="w-5 h-5" />;
};

// Helper function to format file size
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function Attachments({ noteId, attachments = [] }) {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    // Mock loading states since we don't have the actual mutations
    const isUploading = false;
    const isRemoving = false;

    // Handle file selection
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files || []);
        setSelectedFiles(files);
    };

    // Handle drag and drop
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const files = Array.from(e.dataTransfer.files);
            setSelectedFiles(files);
        }
    };

    // Handle file upload
    const handleUpload = async () => {
        // Mock function for demo
        console.log("Upload would happen here");
    };

    // Remove specific attachment
    const handleRemoveAttachment = async (attachmentIndex) => {
        // Mock function for demo
        console.log("Remove attachment would happen here");
    };

    // Clear selected files
    const handleClearSelected = () => {
        setSelectedFiles([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Open file picker
    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    // Handle file preview/download
    const handleFileAction = (url, filename, action = 'preview') => {
        if (action === 'download') {
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            window.open(url, '_blank');
        }
    };

    return (
        <div className="space-y-4 p-4 relative">
            {/* In Development Overlay */}
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 rounded-lg flex items-center justify-center">
                <div className="bg-yellow-100 border-2 border-yellow-300 rounded-lg p-6 shadow-lg max-w-sm text-center">
                    <Wrench className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">Feature In Development</h3>
                    <p className="text-sm text-yellow-700">
                        File attachments are currently being developed and will be available soon.
                    </p>
                </div>
            </div>

            {/* Faded Content */}
            <div className="opacity-30 pointer-events-none">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileIcon className="w-5 h-5" />
                            File Attachments
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Drag and Drop Area */}
                        <div
                            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive
                                ? "border-blue-400 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                                }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={openFilePicker}
                        >
                            <div className="flex flex-col items-center gap-2 cursor-pointer">
                                <Upload className="w-8 h-8 text-gray-400" />
                                <div className="text-sm">
                                    <span className="font-medium text-gray-700">
                                        Click to upload
                                    </span>
                                    <span className="text-gray-500"> or drag and drop</span>
                                </div>
                                <span className="text-xs text-gray-500">
                                    Images, PDFs, videos, audio files (Max 5 files)
                                </span>
                            </div>
                        </div>

                        {/* File Input */}
                        <Input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            className="hidden"
                            accept="image/*,application/pdf,video/*,audio/*,.doc,.docx,.txt"
                            onChange={handleFileChange}
                        />

                        {/* Selected Files Preview */}
                        {selectedFiles.length > 0 && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium">
                                        Selected Files ({selectedFiles.length})
                                    </Label>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleClearSelected}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <X className="w-4 h-4 mr-1" />
                                        Clear
                                    </Button>
                                </div>
                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                    {selectedFiles.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                {getFileIcon(file.type)}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    const newFiles = selectedFiles.filter((_, i) => i !== index);
                                                    setSelectedFiles(newFiles);
                                                }}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="flex gap-2">
                        <Button
                            onClick={handleUpload}
                            disabled={!selectedFiles.length || isUploading}
                            className="flex-1"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload Files
                                </>
                            )}
                        </Button>
                        {selectedFiles.length > 0 && (
                            <Button variant="outline" onClick={handleClearSelected}>
                                Cancel
                            </Button>
                        )}
                    </CardFooter>
                </Card>

                {/* Existing Attachments */}
                {attachments && attachments.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <FileIcon className="w-5 h-5" />
                                    Uploaded Files ({attachments.length})
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {attachments.map((attachment, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            {getFileIcon(attachment.mimeType)}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate" title={attachment.filename}>
                                                    {attachment.filename}
                                                </p>
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <span>{formatFileSize(attachment.size)}</span>
                                                    <span>•</span>
                                                    <span>{attachment.mimeType}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 ml-2">
                                            {/* Preview/View Button */}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleFileAction(attachment.url, attachment.filename, 'preview')}
                                                title="View file"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>

                                            {/* Download Button */}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleFileAction(attachment.url, attachment.filename, 'download')}
                                                title="Download file"
                                            >
                                                <Download className="w-4 h-4" />
                                            </Button>

                                            {/* Remove Button */}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveAttachment(index)}
                                                disabled={isRemoving}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                title="Remove file"
                                            >
                                                {isRemoving ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Empty State */}
                {(!attachments || attachments.length === 0) && (
                    <Card>
                        <CardContent className="text-center py-8">
                            <FileIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500 mb-2">No attachments yet</p>
                            <p className="text-sm text-gray-400">Upload files to attach them to this note</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}