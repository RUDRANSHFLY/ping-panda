import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React, { AnchorHTMLAttributes, ReactNode } from "react";

interface ShinnyButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: ReactNode;
  href?: string;
  className?: string;
}

const ShinnyButton = ({
  children,
  className,
  href,
  ...props
}: ShinnyButtonProps) => {
  return (
    <Link
      href={href ?? "#"}
      className={cn(
        "group relative flex transform items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-md border border-white bg-fuchsia-700 px-8 text-base/7 font-medium text-white transition-all duration-300 hover:ring-2 hover:ring-fuchsia-700 hover:ring-offset-2 focus:outline-none focus:ring-2 focus:ring-offset-2",
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
        <ArrowRight className="size-4 shrink-0 transition-transform duration-300 ease-in-out group-hover:translate-x-[2px]" />
      </span>
      <div className="ease-[cubic-bezier(0.19,1,0.22,1)] absolute -left-[75px] -top-[50px] -z-10 h-[155px] w-10 rotate-[35deg] bg-white opacity-50 transition-all duration-500 group-hover:left-[120%]" />


    </Link>
  );
};

export default ShinnyButton;
