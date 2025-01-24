import { Button } from "@/components/ui/button";
import { Home, MessageCircle, Plus } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SignOutButton } from "@clerk/nextjs";

export function FeedSidebar() {
  return (
    <div className="w-[60px] lg:w-[180px] h-screen flex flex-col justify-between border-r border-gray-800 pt-10">
      <div className="space-y-2 px-2">
        <Link href="/feed">
          <Button
            variant="ghost"
            size="lg"
            className="w-full justify-start gap-2"
          >
            <Home className="h-5 w-5" />
            <span className="hidden lg:inline">For You</span>
          </Button>
        </Link>
        {/* <Link href="/explore">
          <Button
            variant="ghost"
            size="lg"
            className="w-full justify-start gap-2"
          >
            <Compass className="h-5 w-5" />
            <span className="hidden lg:inline">Explore</span>
          </Button>
        </Link> */}
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
        {/* <Link href="/profile">
          <Button
            variant="ghost"
            size="lg"
            className="w-full justify-start gap-2"
          >
            <User className="h-5 w-5" />
            <span className="hidden lg:inline">Profile</span>
          </Button>
        </Link> */}
      </div>
      <div className="flex justify-end px-7 py-7">
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="hover:cursor-pointer">
            <Avatar>
              <AvatarImage></AvatarImage>
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild className="w-full">
              <SignOutButton />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
