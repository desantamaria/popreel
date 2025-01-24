import { FeedSidebar } from "@/components/feed-sidebar";
import { VideoFeed } from "@/components/video-feed";

export default function Page() {
  return (
    <div className="flex h-screen bg-black text-white">
      <FeedSidebar />
      <main className="flex-1 relative">
        <VideoFeed />
      </main>
    </div>
  );
}
