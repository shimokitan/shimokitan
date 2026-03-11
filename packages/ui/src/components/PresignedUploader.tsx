
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { cn } from "../lib/utils";

interface PresignedUploaderProps {
    value?: string | null;  // Current URL (main file)
    onUploadStart?: () => void;
    onUploadSuccess: (url: string, key: string, allFiles?: { url: string, key: string }[]) => void;
    onUploadError?: (error: any) => void;
    context: "artifacts" | "profiles" | "zines" | "collections";
    contextId: string;
    accept?: string;
    label?: string;
    className?: string;
    multiple?: boolean;
    preserveFilename?: boolean;
}

/**
 * PresignedUploader
 * Direct browser-to-R2 uploader using presigned URLs.
 * Enterprise-grade scalability: supports batch/HLS uploads.
 */
export function PresignedUploader({ 
    value, 
    onUploadStart,
    onUploadSuccess, 
    onUploadError,
    context, 
    contextId, 
    accept = "image/*", 
    label = "UPLOAD_FILES",
    className,
    multiple = false,
    preserveFilename = false
}: PresignedUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState("");
    const [preview, setPreview] = useState<string | null>(value || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setPreview(value || null);
    }, [value]);

    const getFileType = (file: File) => {
        if (file.name.endsWith('.m3u8')) return 'application/x-mpegURL';
        if (file.name.endsWith('.ts')) return 'video/MP2T';
        if (file.name.endsWith('.m4s')) return 'video/iso.segment';
        if (file.name.endsWith('.m4a')) return 'audio/mp4';
        return file.type || 'application/octet-stream';
    };

    const uploadFile = async (file: File): Promise<{ url: string, key: string }> => {
        const contentType = getFileType(file);

        // 1. Get Presigned URL
        const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                filename: file.name,
                contentType,
                preserveFilename,
                context,
                contextId
            })
        });

        if (!res.ok) throw new Error(`FAILED_TO_GET_PRESIGNED_URL_${file.name}`);
        const { uploadUrl, url, key } = await res.json();

        // 2. Upload directly to R2
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('PUT', uploadUrl, true);
            xhr.setRequestHeader('Content-Type', contentType);

            xhr.onload = () => {
                if (xhr.status === 200) {
                    resolve({ url, key });
                } else {
                    reject(new Error(`R2_UPLOAD_FAILED_${file.name}: ${xhr.status}`));
                }
            };

            xhr.onerror = () => reject(new Error(`NETWORK_ERROR_${file.name}`));
            xhr.send(file);
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setUploading(true);
        if (onUploadStart) onUploadStart();

        try {
            const uploaded: { url: string, key: string }[] = [];
            
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                setStatusText(`UPLOADING ${i + 1}/${files.length}: ${file.name}`);
                setProgress(((i) / files.length) * 100);
                
                const result = await uploadFile(file);
                uploaded.push(result);
            }

            setProgress(100);
            setStatusText("UPLOAD_COMPLETE");
            
            // For HLS, we want the .m3u8 to be the "primary" URL if it exists
            const primary = uploaded.find(u => u.url.endsWith('.m3u8')) || uploaded[0];
            
            setPreview(primary.url);
            onUploadSuccess(primary.url, primary.key, uploaded);
            setUploading(false);

        } catch (error) {
            console.error('[BATCH_UPLOAD_ERROR]', error);
            if (onUploadError) onUploadError(error);
            setUploading(false);
            setProgress(0);
            setStatusText("ERROR_OCCURRED");
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
                onClick={() => !uploading && fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleFileChange}
                />
                
                {preview || uploading ? (
                   <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-zinc-900/50">
                       <Icon 
                          icon={uploading ? "lucide:loader-2" : (isAudio ? "lucide:music" : "lucide:check-circle")} 
                          width={32} 
                          className={cn("mb-2", uploading ? "animate-spin text-zinc-500" : "text-rose-500")} 
                       />
                       <span className="relative z-10 text-[10px] font-mono text-white bg-black/60 px-2 py-1 rounded text-center">
                           {uploading ? statusText : 'UPLOAD_SYNCED_TO_R2'}
                       </span>
                   </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-zinc-600 group-hover:text-rose-500 transition-colors p-4 text-center">
                        <Icon icon={isAudio ? "lucide:mic-2" : "lucide:layers"} width={24} />
                        <span className="text-[10px] font-mono mt-2 tracking-widest uppercase">{label}</span>
                    </div>
                )}

                {uploading && (
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-zinc-900 z-10">
                        <div
                            className="h-full bg-rose-600 transition-all duration-300 relative overflow-hidden"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}


