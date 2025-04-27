import React from "react";
import MaxWidthWrapper from "./max-width-wrapper";
import Link from "next/link";

import { SignOutButton } from "@clerk/nextjs";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const NavBar = () => {
  const user = false;

  return (
    <nav className="sticky z-[100] h-16 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/80 backdrop-blue-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-16 items-center justify-between">
          <Link href={"/"} className="flex z-40 font-semibold">
            Ping <span className="text-fuchsia-700">Panda</span>
          </Link>
          <div className="h-full flex items-center space-x-4">
            {user ? (
              <>
                <SignOutButton>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    className="cursor-pointer"
                  >
                    Sign out
                  </Button>
                </SignOutButton>

                <Link
                  href={"/dashboard"}
                  className={buttonVariants({
                    size: "sm",
                    className:
                      "flex items-center gap-1 bg-fuchsia-900 hover:bg-fuchsia-700",
                  })}
                >
                  DashBoard
                  <ArrowRight className="ml-1.5 size-5" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={"/pricing"}
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Pricing
                 
                </Link>
                <Link
                  href={"/sign-in"}
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Sign In
                </Link>
                <div  className="h-8 w-px bg-gray-200"/>
                <Link
                  href={"/sign-up"}
                  className={buttonVariants({
                    size: "sm",
                    className:
                    "flex items-center gap-1 bg-fuchsia-900 hover:bg-fuchsia-700",
                  })}
                >
                  Sign Up
                  <ArrowRight className="ml-1.5 size-5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default NavBar;
