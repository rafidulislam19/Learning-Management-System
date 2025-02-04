"use client";

import { useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";

interface VideoPlayerHomeProps {
    playbackId: string;
    courseId: string;
    chapterId: string;
    nextChapterId?: string;
    isLocked: boolean;
    title: string;
};

export const VideoPlayerHome = ({
    playbackId,
    isLocked,
    title,
}: VideoPlayerHomeProps) => {
    const [isReady, setIsReady] = useState(false);


    return ( 
        <div className="relative aspect-video">
            {!isReady && !isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <Loader2 className="h-16 w-16 animate-spin text-slate-100" />
                </div>
            )}
            {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-slate-200">
                    <Lock className="h-8 w-8" />
                    <p className="text-sm">
                        This chapter is locked
                    </p>
                </div>
            )}
            {!isLocked && (
                <MuxPlayer
                  title={title}
                  className={cn(
                    !isReady && "hidden"
                  )}
                  onCanPlay={() => setIsReady(true)}
                  onError={(e) => console.error("MuxPlayer Error:", e)}
                  autoPlay
                  playbackId={playbackId}
                />
                
            )}
        </div>
     );
}