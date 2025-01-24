"use client";

import { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BookmarkIcon, Heart, MessageCircle, Share2 } from "lucide-react";

interface VideoPostProps {
  url: string;
  caption: string;
  username: string;
  likes: string;
  comments: string;
  shares: string;
  bookmarks: string;
  isActive: boolean;
}

export function VideoPost({
  url,
  caption,
  username,
  likes,
  comments,
  shares,
  bookmarks,
  isActive,
}: VideoPostProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isActive]);

  useEffect(() => {
    const handleResize = () => {
      if (videoRef.current) {
        const video = videoRef.current;
        const aspectRatio = video.videoWidth / video.videoHeight;
        const windowRatio = window.innerWidth / window.innerHeight;

        if (aspectRatio > windowRatio) {
          video.style.width = "100%";
          video.style.height = "auto";
        } else {
          video.style.width = "auto";
          video.style.height = "100%";
        }
      }
    };

    window.addEventListener("resize", handleResize);
    if (videoRef.current) {
      videoRef.current.addEventListener("loadedmetadata", handleResize);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (videoRef.current) {
        videoRef.current.removeEventListener("loadedmetadata", handleResize);
      }
    };
  }, []);

  return (
    <div className="relative h-screen w-full flex-shrink-0 bg-black overflow-hidden flex items-center justify-center">
      <video
        ref={videoRef}
        src={url}
        className="absolute inset-0 w-full h-full object-contain"
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-12 p-4">
        <div className="mb-4">
          <h2 className="font-semibold text-lg text-white">{username}</h2>
          <p className="text-sm text-white">{caption}</p>
        </div>
      </div>
      <div className="absolute right-2 bottom-20 flex flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full bg-black/20 backdrop-blur-sm text-white"
          >
            <Heart className="h-7 w-7" />
          </Button>
          <span className="text-sm text-white">{likes}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full bg-black/20 backdrop-blur-sm text-white"
          >
            <MessageCircle className="h-7 w-7" />
          </Button>
          <span className="text-sm text-white">{comments}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full bg-black/20 backdrop-blur-sm text-white"
          >
            <BookmarkIcon className="h-7 w-7" />
          </Button>
          <span className="text-sm text-white">{bookmarks}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full bg-black/20 backdrop-blur-sm text-white"
          >
            <Share2 className="h-7 w-7" />
          </Button>
          <span className="text-sm text-white">{shares}</span>
        </div>
        <Avatar className="h-12 w-12 border-2 border-white">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>UN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
