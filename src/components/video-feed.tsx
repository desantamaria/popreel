"use client";

import { useState, useRef, useEffect, use } from "react";
import { VideoPost } from "./video-post";
import { useVideoStore } from "@/stores/video-store";
import { FetchVideos } from "@/actions/fetchVideos";

export function VideoFeed() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { videos, setVideos } = useVideoStore();

  useEffect(() => {
    const callFetchVideos = async () => {
      const newVideos = await FetchVideos();
      console.log(newVideos);
      setVideos(newVideos);
    };
    callFetchVideos();
  }, []);

  const mockVideos = [
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
    <div
      className="h-screen overflow-hidden snap-y snap-mandatory"
      onWheel={handleScroll}
    >
      <div
        ref={containerRef}
        className="transition-transform duration-500 ease-in-out"
        style={{ height: `${videos.length * 100}vh` }}
      >
        {videos.length > 1 ? (
          <>
            {videos.map((video, index) => (
              <div key={video.id} className="snap-start h-screen">
                <VideoPost
                  url={video.videoUrl}
                  caption={video.caption || ""}
                  username={video.id}
                  likes={`${video.likesCount}`}
                  comments={`${video.commentsCount}`}
                  shares={`${video.sharesCount}`}
                  bookmarks={`${video.bookmarksCount}`}
                  isActive={index === currentVideoIndex}
                />
              </div>
            ))}{" "}
          </>
        ) : (
          <>
            {mockVideos.map((video, index) => (
              <div key={video.id} className="snap-start h-screen">
                <VideoPost {...video} isActive={index === currentVideoIndex} />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
