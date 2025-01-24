"use client";

import { useState, useRef, useEffect } from "react";
import { VideoPost } from "./video-post";

export function VideoFeed() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const videos = [
    {
      id: 1,
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      caption: "Amazing video #viral #trending",
      username: "@user1",
      likes: "402.8K",
      comments: "22K",
      shares: "55.7K",
      bookmarks: "52.3K",
    },
    {
      id: 2,
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      caption: "Check this out! #fyp #foryou",
      username: "@user2",
      likes: "892K",
      comments: "45K",
      shares: "123K",
      bookmarks: "78.5K",
    },
    {
      id: 3,
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      caption: "Another cool video #trending",
      username: "@user3",
      likes: "756K",
      comments: "34K",
      shares: "89K",
      bookmarks: "67K",
    },
  ];

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
    <div className="h-screen overflow-hidden" onWheel={handleScroll}>
      <div
        ref={containerRef}
        className="transition-transform duration-500 ease-in-out"
      >
        {videos.map((video, index) => (
          <VideoPost
            key={video.id}
            {...video}
            isActive={index === currentVideoIndex}
          />
        ))}
      </div>
    </div>
  );
}
