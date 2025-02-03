"use client";

import {
  getVideoInteractions,
  shareVideo,
  toggleBookmark,
  toggleLike,
} from "@/app/actions/interactions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BookmarkIcon, Eye, Heart, MessageCircle, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface VideoPostProps {
  id: string;
  url: string;
  caption: string;
  username: string;
  userAvatar: string;
  isActive: boolean;
}

export function VideoPost({
  id,
  url,
  caption,
  username,
  userAvatar,
  isActive,
}: VideoPostProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [likesCount, setLikesCount] = useState(0);
  const [likeToggle, setLikeToggle] = useState(false);
  const [bookmarksCount, setBookmarksCount] = useState(0);
  const [bookmarkToggle, setBookmarkToggle] = useState(false);
  const [sharesCount, setSharesCount] = useState(0);

  const [views, setViews] = useState(0);

  useEffect(() => {
    async function fetchAnalytics() {
      const results = await getVideoInteractions(id);
      setLikesCount(results?.totalLikes || 0);
      setBookmarksCount(results?.totalBookmarks || 0);
      setSharesCount(results?.totalShares || 0);
      setViews(results?.totalViews || 0);
    }
    fetchAnalytics();
  }, []);

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
        className="absolute h-full object-contain"
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
          <Eye className="h-7 w-7" />
          <span className="text-sm text-white">{views}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full bg-black/20 backdrop-blur-sm text-white"
            onClick={async () => {
              const isDislike = await toggleLike(id);
              setLikeToggle(!isDislike);
              setLikesCount(isDislike ? likesCount - 1 : likesCount + 1);
            }}
          >
            <Heart className="h-7 w-7" fill={likeToggle ? "red" : ""} />
          </Button>
          <span className="text-sm text-white">{likesCount}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full bg-black/20 backdrop-blur-sm text-white"
          >
            <MessageCircle className="h-7 w-7" />
          </Button>
          <span className="text-sm text-white">{0}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full bg-black/20 backdrop-blur-sm text-white"
            onClick={async () => {
              const isUnBookmark = await toggleBookmark(id);
              setBookmarkToggle(!isUnBookmark);
              setBookmarksCount(
                isUnBookmark ? bookmarksCount - 1 : bookmarksCount + 1
              );
            }}
          >
            <BookmarkIcon
              className="h-7 w-7"
              fill={bookmarkToggle ? "gold" : ""}
            />
          </Button>
          <span className="text-sm text-white">{bookmarksCount}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full bg-black/20 backdrop-blur-sm text-white"
            onClick={() => {
              shareVideo(id);
              setSharesCount((prev) => prev + 1);
            }}
          >
            <Share2 className="h-7 w-7" />
          </Button>
          <span className="text-sm text-white">{sharesCount}</span>
        </div>
        <Avatar className="h-12 w-12 border-2 border-white">
          <AvatarImage src={userAvatar} />
          <AvatarFallback>{username.charAt(1)}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
