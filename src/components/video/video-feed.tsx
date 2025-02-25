"use client";

import { getVideos } from "@/app/actions/video";
import { useVideoStore } from "@/stores/video-store";
import { useEffect, useRef, useState } from "react";
import { VideoPost } from "./video-post";
// import { handleView } from "@/app/actions/interactions";

export function VideoFeed() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { videos, setVideos } = useVideoStore();

  useEffect(() => {
    const callFetchVideos = async () => {
      const newVideos = await getVideos();
      setVideos(newVideos);
      console.log(newVideos);
      if (newVideos.length > 0) {
        // handleView(newVideos[currentVideoIndex].id);
      }
    };
    callFetchVideos();
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      handleScroll(e);
    } else if (e.key === "ArrowDown") {
      handleScroll(e);
    }
  };

  const handleScroll = async (e: React.WheelEvent | KeyboardEvent) => {
    if (isScrolling) return;

    if (
      (e instanceof WheelEvent &&
        e.deltaY > 0 &&
        currentVideoIndex < videos.length - 1) ||
      (e instanceof KeyboardEvent && e.key == "ArrowDown")
    ) {
      setIsScrolling(true);
      setCurrentVideoIndex((prev) => prev + 1);
      //   handleView(videos[currentVideoIndex + 1].id);
      setTimeout(() => setIsScrolling(false), 500);
    } else if (
      (e instanceof WheelEvent && e.deltaY < 0 && currentVideoIndex > 0) ||
      (e instanceof KeyboardEvent && e.key == "ArrowUp")
    ) {
      setIsScrolling(true);
      setCurrentVideoIndex((prev) => prev - 1);
      //   handleView(videos[currentVideoIndex - 1].id);
      setTimeout(() => setIsScrolling(false), 500);
    }

    console.log(currentVideoIndex);
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
              isActive={index === currentVideoIndex}
            />
          </div>
        ))}{" "}
      </div>
    </div>
  );
}
