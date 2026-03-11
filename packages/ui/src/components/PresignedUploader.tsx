
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { cn } from "../lib/utils";

interface PresignedUploaderProps {
    value?: string | null;  // Current URL
    onUploadStart?: () => void;
    onUploadSuccess: (url: string, key: string) => void;
    onUploadError?: (error: any) => void;
    context: "artifacts" | "profiles" | "zines" | "collections";
    contextId: string;
    accept?: string;
    label?: string;
    className?: string;
}

/**
 * PresignedUploader
 * Direct browser-to-R2 uploader using presigned URLs.
 * Enterprise-grade scalability: bypasses Next.js server for file steam.
 */
export function PresignedUploader({ 
    value, 
    onUploadStart,
    onUploadSuccess, 
    onUploadError,
    context, 
    contextId, 
    accept = "image/*", 
    label = "UPLOAD_FILE",
    className 
}: PresignedUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [preview, setPreview] = useState<string | null>(value || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setPreview(value || null);
    }, [value]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        if (onUploadStart) onUploadStart();

        try {
            // 1. Get Presigned URL from our API
            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filename: file.name,
                    contentType: file.type || 'application/octet-stream',
                    context,
                    contextId
                })
            });

            if (!res.ok) throw new Error('FAILED_TO_GET_PRESIGNED_URL');
            const { uploadUrl, url, key } = await res.json();

            // 2. Upload directly to R2
            const xhr = new XMLHttpRequest();
            xhr.open('PUT', uploadUrl, true);
            xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentComplete = (event.loaded / event.total) * 100;
                    setProgress(percentComplete);
                }
            };

            xhr.onload = () => {
                if (xhr.status === 200) {
                    setProgress(100);
                    setPreview(url);
                    onUploadSuccess(url, key);
                    setUploading(false);
                } else {
                    throw new Error(`R2_UPLOAD_FAILED: ${xhr.status}`);
                }
            };

            xhr.onerror = () => {
                throw new Error('NETWORK_ERROR_DURING_UPLOAD');
            };

            xhr.send(file);

        } catch (error) {
            console.error('[PRESIGNED_UPLOAD_ERROR]', error);
            if (onUploadError) onUploadError(error);
            setUploading(false);
            setProgress(0);
        }
    };

    const isAudio = accept.includes('audio');

    return (
        <div className="flex flex-col gap-3 w-full">
            <div
                className={cn(
                    "group relative bg-zinc-950 border border-zinc-900 rounded-lg overflow-hidden flex flex-col items-center justify-center cursor-pointer hover:border-rose-600 transition-all shrink-0",
                    className || "w-full h-32"
                )}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept={accept}
                    onChange={handleFileChange}
                />
                
                {preview ? (
                   <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-zinc-900/50">
                       {isAudio ? (
                           <Icon icon="lucide:music" width={32} className="text-rose-500 mb-2" />
                       ) : (
                           <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                       )}
                       <span className="relative z-10 text-[10px] font-mono text-white bg-black/60 px-2 py-1 rounded">
                           {uploading ? `UPLOADING_${Math.round(progress)}%` : 'FILE_STAGED_READY'}
                       </span>
                   </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-zinc-600 group-hover:text-rose-500 transition-colors p-4 text-center">
                        <Icon icon={isAudio ? "lucide:mic" : "lucide:upload-cloud"} width={24} />
                        <span className="text-[10px] font-mono mt-2 tracking-widest uppercase">{label}</span>
                    </div>
                )}

                {uploading && (
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-zinc-900 z-10">
                        <div
                            className="h-full bg-rose-600 transition-all duration-300 relative overflow-hidden"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
