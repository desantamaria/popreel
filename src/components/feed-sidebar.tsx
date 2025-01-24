import { Button } from "@/components/ui/button";
import { Compass, Home, MessageCircle, Plus, Radio, User } from "lucide-react";
import Link from "next/link";

export function FeedSidebar() {
  return (
    <div className="w-[60px] lg:w-[180px] h-screen flex-shrink-0 border-r border-gray-800">
      <div className="space-y-2 px-2">
        <Link href="/">
          <Button
            variant="ghost"
            size="lg"
            className="w-full justify-start gap-2"
          >
            <Home className="h-5 w-5" />
            <span className="hidden lg:inline">For You</span>
          </Button>
        </Link>
        <Link href="/explore">
          <Button
            variant="ghost"
            size="lg"
            className="w-full justify-start gap-2"
          >
            <Compass className="h-5 w-5" />
            <span className="hidden lg:inline">Explore</span>
          </Button>
        </Link>
        <Link href="/following">
          <Button
            variant="ghost"
            size="lg"
            className="w-full justify-start gap-2"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="hidden lg:inline">Following</span>
          </Button>
        </Link>
        <Link href="/live">
          <Button
            variant="ghost"
            size="lg"
            className="w-full justify-start gap-2"
          >
            <Radio className="h-5 w-5" />
            <span className="hidden lg:inline">LIVE</span>
          </Button>
        </Link>
        <Link href="/upload">
          <Button
            variant="ghost"
            size="lg"
            className="w-full justify-start gap-2"
          >
            <Plus className="h-5 w-5" />
            <span className="hidden lg:inline">Upload</span>
          </Button>
        </Link>
        <Link href="/profile">
          <Button
            variant="ghost"
            size="lg"
            className="w-full justify-start gap-2"
          >
            <User className="h-5 w-5" />
            <span className="hidden lg:inline">Profile</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
