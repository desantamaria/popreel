"use client";

import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <main>
        <div className="w-full max-w-[75rem] mx-auto flex flex-col p-10 gap-10">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Pop Reel
          </h1>
          <div className="relative flex gap-3">
            <SignedIn>
              <Link
                href="/feed"
                className="px-4 py-2 rounded-full bg-[#131316] text-white text-sm font-semibold"
              >
                Feed
              </Link>
            </SignedIn>
            <SignedOut>
              <Button asChild className="rounded-full">
                <SignInButton />
              </Button>
            </SignedOut>
          </div>
        </div>
      </main>
    </>
  );
}
