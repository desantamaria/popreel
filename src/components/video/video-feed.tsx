"use client";

import { getVideos } from "@/app/actions/video";
import { useVideoStore } from "@/stores/video-store";
import { useEffect, useRef, useState } from "react";
import { VideoPost } from "./video-post";

export function VideoFeed() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { videos, setVideos } = useVideoStore();

  useEffect(() => {
    const callFetchVideos = async () => {
      const newVideos = await getVideos();
      setVideos(newVideos);
    };
    callFetchVideos();
  }, []);

  const handleScroll = (e: React.WheelEvent) => {
    if (isScrolling) return;

    if (e.deltaY > 0 && currentVideoIndex < videos.length - 1) {
      setIsScrolling(true);
      setCurrentVideoIndex((prev) => prev + 1);
      setTimeout(() => setIsScrolling(false), 500); // Match this with CSS transition duration
    } else if (e.deltaY < 0 && currentVideoIndex > 0) {
      setIsScrolling(true);
      setCurrentVideoIndex((prev) => prev - 1);
      setTimeout(() => setIsScrolling(false), 500); // Match this with CSS transition duration
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.transform = `translateY(-${
        currentVideoIndex * 100
      }vh)`;
    }
  }, [currentVideoIndex]);

  return (
    <div
      className="h-screen overflow-hidden snap-y snap-mandatory"
      onWheel={handleScroll}
    >
      <div
        ref={containerRef}
        className="transition-transform duration-500 ease-in-out"
        style={{ height: `${videos.length * 100}vh` }}
      >
        {videos.map((video, index) => (
          <div key={video.id} className="snap-start h-screen">
            <VideoPost
              id={video.id}
              url={video.videoUrl}
              caption={video.caption || ""}
              username={video.userName || "user"}
              userAvatar={video.userAvatar || ""}
              likes={`0`}
              comments={`0`}
              shares={`0`}
              bookmarks={`0`}
              isActive={index === currentVideoIndex}
            />
          </div>
        ))}{" "}
      </div>
    </div>
  );
}
