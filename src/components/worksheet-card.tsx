"use client";

import { useState } from "react";
import { Eye } from "lucide-react";

interface WorksheetCardProps {
    title: string;
    embedUrl: string;
    thumbnailUrl: string;
    downloadUrl: string;
    isAdmin: boolean;
    deleteButton?: React.ReactNode;
}

export function WorksheetCard({ 
    title, 
    embedUrl, 
    thumbnailUrl, 
    downloadUrl, 
    isAdmin, 
    deleteButton 
}: WorksheetCardProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm flex flex-col group">
            <div 
                className={`aspect-video w-full bg-gray-100 relative ${!isLoaded ? 'cursor-pointer' : ''}`}
                onClick={() => !isLoaded && setIsLoaded(true)}
            >
                {isLoaded ? (
                    <iframe
                        src={embedUrl}
                        className="w-full h-full border-none"
                        allow="autoplay"
                    ></iframe>
                ) : (
                    <>
                        <img 
                            src={thumbnailUrl} 
                            alt={title} 
                            className="w-full h-full object-cover filter blur-[1px] opacity-60 group-hover:blur-0 group-hover:opacity-100 transition-all duration-300"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/5 group-hover:bg-black/10 transition-colors">
                            <div className="bg-white/90 p-3 rounded-full shadow-lg transform group-hover:scale-110 transition-transform flex items-center justify-center">
                                <Eye className="w-6 h-6 text-primary" />
                            </div>
                            <span className="mt-3 text-[10px] font-bold uppercase tracking-wider text-gray-700 bg-white/90 px-3 py-1 rounded-full shadow-sm">
                                Klik untuk Melihat Preview
                            </span>
                        </div>
                    </>
                )}
            </div>
            <div className="p-4 flex flex-col flex-1 justify-between gap-4 bg-white">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                        {title}
                    </h3>
                    {isAdmin && deleteButton}
                </div>
                {downloadUrl && (
                    <a
                        href={downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary hover:text-white transition-all text-center flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                        </svg>
                        Download PDF
                    </a>
                )}
            </div>
        </div>
    );
}
