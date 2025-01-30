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
    courseId,
    chapterId,
    nextChapterId,
    isLocked,
    title,
}: VideoPlayerHomeProps) => {
    const [isReady, setIsReady] = useState(false);


    return ( 
        <div className="relative aspect-video">
            {!isReady && !isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <Loader2 className="h-8 w-8 animate-spin text-secondary" />
                </div>
            )}
            {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
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