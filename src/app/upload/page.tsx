"use client";

import { FeedSidebar } from "@/components/feed-sidebar";
import VideoUpload from "@/components/video-upload";

export default function UploadPage() {
  return (
    <div className="flex h-screen bg-black text-white">
      <FeedSidebar />
      <main className="flex-1 relative">
        <div className="flex flex-col justify-center items-center py-10">
          <VideoUpload
            maxSize={10}
            maxDuration={60}
            acceptedFormats={[".mp4", ".mov", ".avi"]}
          />
        </div>
      </main>
    </div>
  );
}
